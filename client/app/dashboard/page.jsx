"use client";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  CalendarDays,
  Mail,
  Shield,
  User,
  Heart,
  BookOpen,
  Upload,
  Award,
} from "lucide-react";

import { UserAuth } from "@/context/AuthContext";
import { getUserByUID } from "@/user_api";

export default function Dashboard() {
  const { user } = UserAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showSavedNotes, setShowSavedNotes] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.uid) {
        const res = await getUserByUID(user.uid);
        if (res) setUserData(res.data);
        setLoading(false);
      }
    };
    fetchUser();
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (loading || !userData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <Card className="w-full">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={userData.profilePic || "/placeholder.svg"}
                  alt={userData.name}
                />
                <AvatarFallback className="text-2xl">
                  {getInitials(userData.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-2xl">{userData.name}</CardTitle>
            <CardDescription className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4" />
              {userData.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Role:</span>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <Shield className="w-3 h-3" />
                      {userData.role.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <Badge
                      variant={
                        userData.status === "active" ? "default" : "secondary"
                      }
                      className="capitalize"
                    >
                      {userData.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Account Dates */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Account Details
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Created:</span>
                    <span className="text-sm">
                      {formatDate(userData.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="text-sm">
                      {formatDate(userData.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Saved Notes */}
          <Card
            className="cursor-pointer"
            onClick={() => setShowSavedNotes((prev) => !prev)}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold">
                      {userData.savedNotes.length}
                    </p>
                    <p className="text-gray-600 text-sm">Saved Notes</p>
                  </div>
                </div>
                <span className="text-sm text-blue-500">
                  {showSavedNotes ? "Hide" : "View"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Upload className="w-8 h-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {userData.uploadedNotes.length}
                  </p>
                  <p className="text-gray-600 text-sm">Uploaded Notes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Heart className="w-8 h-8 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{userData.likes.length}</p>
                  <p className="text-gray-600 text-sm">Likes</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Award className="w-8 h-8 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">{userData.badges.length}</p>
                  <p className="text-gray-600 text-sm">Badges</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Saved Notes Expanded View */}
        {showSavedNotes && (
          <div className="space-y-4">
            {userData.savedNotes.map((note) => (
              <Card
                key={note._id}
                className="border p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => window.location.href = `/notes/${note._id}`}
              >
                <div className="flex flex-col md:flex-row gap-4 items-center">
                  <iframe
                    src={`https://drive.google.com/file/d/${note.gapis_file_id}/preview`}
                    width="100%"
                    height="200"
                    allow="autoplay"
                    className="rounded-md md:w-1/3"
                  ></iframe>
                  <div className="flex-1 space-y-1 md:pl-4">
                    <h4 className="text-lg font-semibold">{note.title}</h4>
                    <p className="text-sm text-gray-600">{note.content}</p>
                    <p className="text-xs text-gray-500">{note.college}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Heart className="w-4 h-4 text-red-500" />
                      {note.likes.length} Likes
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Account Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Account Summary</CardTitle>
            <CardDescription>
              Your account overview and activity summary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium">Account Status</h4>
                  <p className="text-sm text-gray-600">
                    Your account is currently active and in good standing
                  </p>
                </div>
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  Active
                </Badge>
              </div>
              
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
