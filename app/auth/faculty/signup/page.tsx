"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Briefcase, ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { auth, db } from "@/lib/firebase"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { toast } from "sonner"

const departments = [
  "Computer Science",
  "Information Technology",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electronics & Communication",
  "Chemical Engineering",
  "Biotechnology",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Commerce",
  "Arts & Humanities",
  "Medicine",
  "Law",
  "Other",
]

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Programming",
  "Data Structures",
  "Algorithms",
  "Database Management",
  "Operating Systems",
  "Computer Networks",
  "Machine Learning",
  "Web Development",
  "Mobile App Development",
  "Digital Electronics",
  "Signal Processing",
  "Control Systems",
  "Thermodynamics",
  "Fluid Mechanics",
  "Engineering Mechanics",
  "English",
  "Economics",
  "Accounting",
  "Statistics",
  "Business Management",
]

const experience = [
  "0-2 years",
  "2-5 years",
  "5-10 years",
  "10-15 years",
  "15+ years",
]

const institutionTypes = [
  "School",
  "College",
  "University",
  "Online Platform",
  "Training Institute",
  "Corporate Training",
  "Other",
]

export default function FacultySignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    department: "",
    specialization: "",
    experience: "",
    institution: "",
    institutionType: "",
    subjectsTeach: [] as string[],
    customSubject: "",
  })

  const handleSubjectToggle = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      subjectsTeach: prev.subjectsTeach.includes(subject)
        ? prev.subjectsTeach.filter((s) => s !== subject)
        : [...prev.subjectsTeach, subject],
    }))
  }

  const addCustomSubject = () => {
    if (formData.customSubject.trim() && !formData.subjectsTeach.includes(formData.customSubject.trim())) {
      setFormData((prev) => ({
        ...prev,
        subjectsTeach: [...prev.subjectsTeach, prev.customSubject.trim()],
        customSubject: "",
      }))
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user

      // Save faculty info to Firestore
      await setDoc(doc(db, "faculty", user.uid), {
        uid: user.uid,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        specialization: formData.specialization,
        experience: formData.experience,
        institution: formData.institution,
        institutionType: formData.institutionType,
        subjectsTeach: formData.subjectsTeach,
        userType: "faculty",
        createdAt: new Date().toISOString(),
      })

      toast.success("Faculty account created successfully!")
      router.push("/teacher")
    } catch (error: any) {
      console.error("Signup error:", error)
      toast.error(error.message || "Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  const canProceedStep1 = formData.firstName && formData.lastName && formData.email && formData.password.length >= 8
  const canProceedStep2 = formData.department && formData.experience && formData.institutionType && formData.institution
  const canSubmit = formData.subjectsTeach.length > 0

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Gradify</span>
          </Link>
          <div className="flex gap-2">
            <span className={`text-sm font-medium ${step === 1 ? "text-primary" : "text-muted-foreground"}`}>
              Step 1
            </span>
            <span className="text-muted-foreground">•</span>
            <span className={`text-sm font-medium ${step === 2 ? "text-primary" : "text-muted-foreground"}`}>
              Step 2
            </span>
            <span className="text-muted-foreground">•</span>
            <span className={`text-sm font-medium ${step === 3 ? "text-primary" : "text-muted-foreground"}`}>
              Step 3
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Create Faculty Account</CardTitle>
                <CardDescription>Personal Information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john.doe@institution.edu"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1 || isLoading}
                  className="w-full"
                  size="lg"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Professional Information</CardTitle>
                <CardDescription>Details about your teaching background</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization / Area of Expertise</Label>
                  <Input
                    id="specialization"
                    placeholder="e.g., Machine Learning, Database Design"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Teaching Experience</Label>
                  <Select value={formData.experience} onValueChange={(value) => setFormData({ ...formData, experience: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experience.map((exp) => (
                        <SelectItem key={exp} value={exp}>{exp}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="institutionType">Institution Type</Label>
                    <Select value={formData.institutionType} onValueChange={(value) => setFormData({ ...formData, institutionType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutionTypes.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution Name</Label>
                    <Input
                      id="institution"
                      placeholder="Your University/College"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1"
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    disabled={!canProceedStep2 || isLoading}
                    className="flex-1"
                    size="lg"
                  >
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Subjects You Teach</CardTitle>
                <CardDescription>Select the subjects you teach (choose at least one)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                  {subjects.map((subject) => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjectsTeach.includes(subject)}
                        onCheckedChange={() => handleSubjectToggle(subject)}
                      />
                      <label htmlFor={subject} className="text-sm font-medium cursor-pointer">
                        {subject}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customSubject">Add Custom Subject</Label>
                  <div className="flex gap-2">
                    <Input
                      id="customSubject"
                      placeholder="Enter subject name"
                      value={formData.customSubject}
                      onChange={(e) => setFormData({ ...formData, customSubject: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          addCustomSubject()
                        }
                      }}
                    />
                    <Button variant="outline" onClick={addCustomSubject}>
                      Add
                    </Button>
                  </div>
                </div>

                {formData.subjectsTeach.length > 0 && (
                  <div className="space-y-2">
                    <Label>Selected Subjects ({formData.subjectsTeach.length})</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.subjectsTeach.map((subject) => (
                        <div
                          key={subject}
                          className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        >
                          {subject}
                          <button
                            onClick={() => handleSubjectToggle(subject)}
                            className="hover:text-primary/70"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    className="flex-1"
                    size="lg"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isLoading}
                    className="flex-1"
                    size="lg"
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                    {!isLoading && <CheckCircle2 className="ml-2 h-4 w-4" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-card p-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link href="/auth/faculty/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
            {" "}•{" "}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              Sign in as student
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
