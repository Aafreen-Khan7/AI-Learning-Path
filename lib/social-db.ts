import { db } from "@/lib/firebase"
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  getDoc,
  Timestamp,
  limit,
  orderBy,
} from "firebase/firestore"

// Types
export interface ForumPost {
  id?: string
  classId: string
  userId: string
  userName: string
  userAvatar?: string
  title: string
  content: string
  replies: number
  likes: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface ForumReply {
  id?: string
  postId: string
  classId: string
  userId: string
  userName: string
  userAvatar?: string
  content: string
  likes: number
  createdAt: Timestamp
}

export interface TokenTransaction {
  id?: string
  userId: string
  classId: string
  amount: number
  type: "quiz_complete" | "forum_post" | "forum_reply" | "helpful_post" | "streak_bonus"
  description: string
  createdAt: Timestamp
}

export interface StudentTokenBalance {
  userId: string
  classId: string
  balance: number
  totalEarned: number
  updatedAt: Timestamp
}

// Forum Operations
export async function createForumPost(
  classId: string,
  userId: string,
  userName: string,
  title: string,
  content: string,
  userAvatar?: string
): Promise<string> {
  try {
    const postRef = await addDoc(collection(db, "forum_posts"), {
      classId,
      userId,
      userName,
      userAvatar,
      title,
      content,
      replies: 0,
      likes: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    return postRef.id
  } catch (error) {
    console.error("Error creating forum post:", error)
    throw error
  }
}

export async function getClassForumPosts(classId: string, limitCount: number = 20): Promise<ForumPost[]> {
  try {
    const postsRef = query(
      collection(db, "forum_posts"),
      where("classId", "==", classId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )

    const snapshot = await getDocs(postsRef)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<ForumPost, "id">
    }))
  } catch (error) {
    console.error("Error fetching forum posts:", error)
    throw error
  }
}

// Forum Reply Operations
export async function createForumReply(
  postId: string,
  classId: string,
  userId: string,
  userName: string,
  content: string,
  userAvatar?: string
): Promise<string> {
  try {
    const replyRef = await addDoc(collection(db, "forum_replies"), {
      postId,
      classId,
      userId,
      userName,
      userAvatar,
      content,
      likes: 0,
      createdAt: Timestamp.now(),
    })

    // Update reply count on post
    const postRef = doc(db, "forum_posts", postId)
    const postDoc = await getDoc(postRef)
    if (postDoc.exists()) {
      await updateDoc(postRef, {
        replies: (postDoc.data().replies || 0) + 1,
      })
    }

    return replyRef.id
  } catch (error) {
    console.error("Error creating forum reply:", error)
    throw error
  }
}

export async function getPostReplies(postId: string): Promise<ForumReply[]> {
  try {
    const repliesRef = query(
      collection(db, "forum_replies"),
      where("postId", "==", postId),
      orderBy("createdAt", "asc")
    )

    const snapshot = await getDocs(repliesRef)

    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Omit<ForumReply, "id">
    }))
  } catch (error) {
    console.error("Error fetching forum replies:", error)
    throw error
  }
}

// Token Operations
export async function awardTokens(
  userId: string,
  classId: string,
  amount: number,
  type: TokenTransaction["type"],
  description: string
): Promise<void> {
  try {
    // Record transaction
    await addDoc(collection(db, "token_transactions"), {
      userId,
      classId,
      amount,
      type,
      description,
      createdAt: Timestamp.now(),
    })

    // Update balance
    const balanceRef = doc(db, "token_balances", `${userId}_${classId}`)
    const balanceDoc = await getDoc(balanceRef)

    if (balanceDoc.exists()) {
      const currentData = balanceDoc.data()
      await updateDoc(balanceRef, {
        balance: (currentData.balance || 0) + amount,
        totalEarned: (currentData.totalEarned || 0) + amount,
        updatedAt: Timestamp.now(),
      })
    } else {
      await addDoc(collection(db, "token_balances"), {
        id: `${userId}_${classId}`,
        userId,
        classId,
        balance: amount,
        totalEarned: amount,
        updatedAt: Timestamp.now(),
      })
    }
  } catch (error) {
    console.error("Error awarding tokens:", error)
    throw error
  }
}

export async function getTokenBalance(
  userId: string,
  classId: string
): Promise<number> {
  try {
    const balanceRef = doc(db, "token_balances", `${userId}_${classId}`)
    const balanceDoc = await getDoc(balanceRef)

    if (balanceDoc.exists()) {
      return balanceDoc.data().balance || 0
    }

    return 0
  } catch (error) {
    console.error("Error fetching token balance:", error)
    throw error
  }
}

export async function getClassLeaderboard(classId: string, limitCount: number = 20): Promise<any[]> {
  try {
    const transactionsRef = query(
      collection(db, "token_transactions"),
      where("classId", "==", classId)
    )

    const snapshot = await getDocs(transactionsRef)

    // Aggregate tokens by user
    const leaderboard: { [key: string]: { userId: string; totalTokens: number; postCount: number; name?: string } } = {}

    snapshot.docs.forEach(doc => {
      const data = doc.data()
      const userId = data.userId
      const userName = data.userName || userId

      if (!leaderboard[userId]) {
        leaderboard[userId] = { userId, totalTokens: 0, postCount: 0, name: userName }
      }

      leaderboard[userId].totalTokens += data.amount

      if (data.type === "forum_post") {
        leaderboard[userId].postCount += 1
      }
    })

    // Convert to array and sort
    return Object.values(leaderboard)
      .sort((a, b) => b.totalTokens - a.totalTokens)
      .slice(0, limitCount)
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    throw error
  }
}

// Helper to get user's rank
export async function getUserRank(
  userId: string,
  classId: string
): Promise<number> {
  try {
    const leaderboard = await getClassLeaderboard(classId, 1000)
    const rank = leaderboard.findIndex(entry => entry.userId === userId) + 1
    return rank || 0
  } catch (error) {
    console.error("Error fetching user rank:", error)
    throw error
  }
}
