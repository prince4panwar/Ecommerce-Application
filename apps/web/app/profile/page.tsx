"use client";

import { useEffect, useState } from "react";
import { api, getToken } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Camera, MapPin, Trash2, Edit2, CheckCircle2, XCircle, LogOut } from "lucide-react";

interface Address {
      id: string;
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
}

interface UserProfile {
      id: string;
      email: string;
      name: string | null;
      role: string;
      avatarUrl: string | null;
      coverImageUrl: string | null;
      vendor?: {
            storeName: string;
            bio: string | null;
      };
      customer?: {
            bio: string | null;
            addresses: Address[];
      };
}

export default function ProfilePage() {
      const router = useRouter();
      const [profile, setProfile] = useState<UserProfile | null>(null);
      const [loading, setLoading] = useState(true);
      const [editing, setEditing] = useState(false);

      // Edit State
      const [formData, setFormData] = useState({
            name: "",
            bio: "",
            storeName: "",
            avatarUrl: "",
            coverImageUrl: ""
      });

      // Address State
      const [isAddingAddress, setIsAddingAddress] = useState(false);
      const [newAddress, setNewAddress] = useState({
            street: "",
            city: "",
            state: "",
            zip: "",
            country: ""
      });

      useEffect(() => {
            const token = getToken();
            if (!token) {
                  router.push("/login");
                  return;
            }
            fetchProfile();
      }, [router]);

      const fetchProfile = async () => {
            try {
                  const { data } = await api.get("/users/profile");
                  setProfile(data);
                  setFormData({
                        name: data.name || "",
                        bio: data.vendor?.bio || data.customer?.bio || "",
                        storeName: data.vendor?.storeName || "",
                        avatarUrl: data.avatarUrl || "",
                        coverImageUrl: data.coverImageUrl || ""
                  });
            } catch (error) {
                  toast.error("Failed to load profile");
                  router.push("/login");
            } finally {
                  setLoading(false);
            }
      };

      const handleUpdate = async () => {
            try {
                  const { data } = await api.put("/users/profile", formData);
                  setProfile(data);
                  setEditing(false);
                  toast.success("Profile updated successfully");
            } catch (error) {
                  toast.error("Failed to update profile");
            }
      };

      const handleAddAddress = async () => {
            try {
                  await api.post("/users/address", newAddress);
                  toast.success("Address added");
                  setIsAddingAddress(false);
                  setNewAddress({ street: "", city: "", state: "", zip: "", country: "" });
                  fetchProfile();
            } catch (error) {
                  toast.error("Failed to add address");
            }
      };

      const handleDeleteAddress = async (id: string) => {
            try {
                  await api.delete(`/users/address/${id}`);
                  toast.success("Address deleted");
                  fetchProfile();
            } catch (error) {
                  toast.error("Failed to delete address");
            }
      };

      const fetchLocation = () => {
            if (!navigator.geolocation) {
                  toast.error("Geolocation is not supported by your browser");
                  return;
            }

            const loadingToast = toast.loading("Fetching your location...");
            navigator.geolocation.getCurrentPosition(
                  async (position) => {
                        try {
                              const { latitude, longitude } = position.coords;
                              // Use OpenStreetMap Nominatim for reverse geocoding
                              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                              const data = await response.json();

                              const addr = data.address;
                              setNewAddress({
                                    street: addr.road || addr.suburb || "",
                                    city: addr.city || addr.town || addr.village || "",
                                    state: addr.state || "",
                                    zip: addr.postcode || "",
                                    country: addr.country || ""
                              });
                              toast.dismiss(loadingToast);
                              toast.success("Location detected!");
                        } catch (err) {
                              toast.dismiss(loadingToast);
                              toast.error("Failed to resolve address from coordinates");
                        }
                  },
                  () => {
                        toast.dismiss(loadingToast);
                        toast.error("Unable to retrieve your location");
                  }
            );
      };

      const handleDeleteAccount = async () => {
            if (!confirm("Are you sure you want to delete your account? This action cannot be undone.")) return;
            try {
                  await api.delete("/users/profile");
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  toast.success("Account deleted");
                  router.push("/login");
            } catch (error) {
                  toast.error("Failed to delete account");
            }
      };

      const handleLogout = () => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.push("/login");
      };

      if (loading) return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
                  <div className="animate-pulse flex flex-col items-center">
                        <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
                        <p className="text-muted-foreground">Loading your profile...</p>
                  </div>
            </div>
      );

      if (!profile) return null;

      const coverUrl = profile.coverImageUrl || "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop";
      const avatarUrl = profile.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.email}`;

      return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
                  {/* Hero Section with Cover Image */}
                  <div className="relative h-64 md:h-80 w-full overflow-hidden group">
                        <img
                              src={editing ? formData.coverImageUrl || coverUrl : coverUrl}
                              alt="Cover"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />

                        {editing && (
                              <label className="absolute bottom-4 right-4 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 rounded-lg cursor-pointer transition-all border border-white/30">
                                    <Camera size={20} />
                                    <input
                                          type="text"
                                          className="hidden"
                                          placeholder="Image URL"
                                          value={formData.coverImageUrl}
                                          onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                                    />
                                    <span className="ml-2 text-sm font-medium">Change Cover</span>
                              </label>
                        )}
                  </div>

                  {/* Profile Info Header */}
                  <div className="container mx-auto px-4 -mt-20 relative z-10">
                        <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
                              <div className="relative group">
                                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-white dark:border-slate-950 shadow-2xl bg-white">
                                          <img
                                                src={editing ? formData.avatarUrl || avatarUrl : avatarUrl}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                          />
                                          {editing && (
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                      <Camera className="text-white" />
                                                </div>
                                          )}
                                    </div>
                              </div>

                              <div className="flex-1 pb-2">
                                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow-md">
                                          {profile.name || "User"}
                                    </h1>
                                    <p className="text-white/80 font-medium drop-shadow-md flex items-center gap-2">
                                          <span className="bg-white/20 backdrop-blur-sm px-3 py-0.5 rounded-full text-sm">
                                                {profile.role}
                                          </span>
                                          <span>•</span>
                                          <span>{profile.email}</span>
                                    </p>
                              </div>

                              <div className="flex gap-2 pb-2">
                                    {editing ? (
                                          <>
                                                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/20" onClick={() => setEditing(false)}>
                                                      <XCircle className="mr-2 h-4 w-4" /> Cancel
                                                </Button>
                                                <Button className="bg-primary hover:bg-primary/90" onClick={handleUpdate}>
                                                      <CheckCircle2 className="mr-2 h-4 w-4" /> Save Profile
                                                </Button>
                                          </>
                                    ) : (
                                          <>
                                                <Button variant="outline" onClick={() => setEditing(true)} className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md">
                                                      <Edit2 className="mr-2 h-4 w-4" /> Edit Profile
                                                </Button>
                                                <Button variant="destructive" onClick={handleLogout} className="bg-red-500/80 hover:bg-red-600 backdrop-blur-md">
                                                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                                                </Button>
                                          </>
                                    )}
                              </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                              {/* Left Column: Basic Details */}
                              <div className="lg:col-span-2 space-y-6">
                                    <Card className="border-none shadow-lg bg-white/70 dark:bg-slate-900/70 backdrop-blur-md">
                                          <CardHeader>
                                                <CardTitle className="text-xl">About Me</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                      <div className="space-y-2">
                                                            <Label className="text-slate-500">Full Name</Label>
                                                            <Input
                                                                  value={formData.name}
                                                                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                                  disabled={!editing}
                                                                  className="bg-slate-50 border-slate-200 focus:bg-white transition-all disabled:bg-transparent disabled:border-transparent disabled:pl-0 font-medium text-lg"
                                                            />
                                                      </div>
                                                      <div className="space-y-2">
                                                            <Label className="text-slate-500">Email Address</Label>
                                                            <p className="py-2 font-medium">{profile.email}</p>
                                                      </div>
                                                </div>

                                                <div className="space-y-2">
                                                      <Label className="text-slate-500">Biography</Label>
                                                      <textarea
                                                            className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:bg-transparent disabled:border-transparent disabled:pl-0 disabled:resize-none font-medium text-slate-700 dark:text-slate-300 h-32"
                                                            value={formData.bio}
                                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                                            disabled={!editing}
                                                            placeholder="Tell us about yourself..."
                                                      />
                                                </div>

                                                {profile.role === "VENDOR" && (
                                                      <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                                                            <Label className="text-slate-500">Store Detail</Label>
                                                            <div className="space-y-4">
                                                                  <div>
                                                                        <Label>Store Name</Label>
                                                                        <Input
                                                                              value={formData.storeName}
                                                                              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                                                                              disabled={!editing}
                                                                              className="bg-slate-50 border-slate-200 focus:bg-white transition-all disabled:bg-transparent disabled:border-transparent disabled:pl-0 font-bold text-xl text-primary"
                                                                        />
                                                                  </div>
                                                            </div>
                                                      </div>
                                                )}

                                                {editing && (
                                                      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-800 animate-in fade-in slide-in-from-top-4">
                                                            <div className="space-y-2">
                                                                  <Label>Avatar Image URL</Label>
                                                                  <Input
                                                                        placeholder="https://example.com/image.jpg"
                                                                        value={formData.avatarUrl}
                                                                        onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                                                                  />
                                                            </div>
                                                            <div className="space-y-2">
                                                                  <Label>Cover Image URL</Label>
                                                                  <Input
                                                                        placeholder="https://example.com/image.jpg"
                                                                        value={formData.coverImageUrl}
                                                                        onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                                                                  />
                                                            </div>
                                                      </div>
                                                )}
                                          </CardContent>
                                    </Card>

                                    {/* Address Section */}
                                    <div className="space-y-4">
                                          <div className="flex items-center justify-between px-2">
                                                <h2 className="text-xl font-bold flex items-center gap-2">
                                                      <MapPin className="text-primary" /> My Addresses
                                                </h2>
                                                <Button variant="outline" size="sm" onClick={() => setIsAddingAddress(!isAddingAddress)}>
                                                      {isAddingAddress ? "Cancel" : "Add New Address"}
                                                </Button>
                                          </div>

                                          {isAddingAddress && (
                                                <Card className="border-primary/20 bg-primary/5 shadow-inner">
                                                      <CardContent className="pt-6 space-y-4">
                                                            <Button
                                                                  type="button"
                                                                  variant="secondary"
                                                                  onClick={fetchLocation}
                                                                  className="w-full flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors"
                                                            >
                                                                  <MapPin size={16} /> Use Current Location
                                                            </Button>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                  <Input
                                                                        placeholder="Street Address"
                                                                        value={newAddress.street}
                                                                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                                                                  />
                                                                  <Input
                                                                        placeholder="City"
                                                                        value={newAddress.city}
                                                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                                  />
                                                                  <Input
                                                                        placeholder="State"
                                                                        value={newAddress.state}
                                                                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                                                                  />
                                                                  <Input
                                                                        placeholder="Zip Code"
                                                                        value={newAddress.zip}
                                                                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                                                                  />
                                                                  <Input
                                                                        placeholder="Country"
                                                                        value={newAddress.country}
                                                                        onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                                                        className="md:col-span-2"
                                                                  />
                                                            </div>
                                                            <Button onClick={handleAddAddress} className="w-full">
                                                                  Save Address
                                                            </Button>
                                                      </CardContent>
                                                </Card>
                                          )}

                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {profile.customer?.addresses.map((addr) => (
                                                      <Card key={addr.id} className="group hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
                                                            <CardContent className="p-4 flex justify-between items-start">
                                                                  <div>
                                                                        <p className="font-bold text-slate-800 dark:text-slate-200">{addr.street}</p>
                                                                        <p className="text-sm text-slate-500">{addr.city}, {addr.state} {addr.zip}</p>
                                                                        <p className="text-sm text-slate-500">{addr.country}</p>
                                                                  </div>
                                                                  <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                        onClick={() => handleDeleteAddress(addr.id)}
                                                                  >
                                                                        <Trash2 size={16} />
                                                                  </Button>
                                                            </CardContent>
                                                      </Card>
                                                ))}
                                                {profile.customer?.addresses.length === 0 && !isAddingAddress && (
                                                      <p className="col-span-full text-center text-muted-foreground py-10 bg-white/50 rounded-xl border-2 border-dashed border-slate-200">
                                                            No addresses saved yet.
                                                      </p>
                                                )}
                                          </div>
                                    </div>
                              </div>

                              {/* Right Column: Settings/Actions */}
                              <div className="space-y-6">
                                    <Card className="border-none shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden">
                                          <CardHeader>
                                                <CardTitle className="text-lg">Security & Privacy</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                                <p className="text-sm text-slate-400">Manage your account settings and privacy preferences.</p>
                                                <Separator className="bg-slate-700" />
                                                <div className="flex items-center justify-between py-2">
                                                      <div>
                                                            <p className="font-medium">Password</p>
                                                            <p className="text-xs text-slate-500 italic">Last changed 2 months ago</p>
                                                      </div>
                                                      <Button variant="link" className="text-primary hover:text-primary/80 h-auto p-0">Change</Button>
                                                </div>
                                                <div className="flex items-center justify-between py-2">
                                                      <div>
                                                            <p className="font-medium">2FA</p>
                                                            <p className="text-xs text-slate-500">Disabled</p>
                                                      </div>
                                                      <Button variant="link" className="text-primary hover:text-primary/80 h-auto p-0">Enable</Button>
                                                </div>
                                          </CardContent>
                                    </Card>

                                    <Card className="border-red-100 bg-red-50/30 dark:bg-red-950/10 dark:border-red-900/20">
                                          <CardHeader>
                                                <CardTitle className="text-red-600 text-lg">Danger Zone</CardTitle>
                                          </CardHeader>
                                          <CardContent className="space-y-4">
                                                <p className="text-sm text-slate-500 italic">Deleting your account is permanent and cannot be reversed. All your data, orders, and history will be lost.</p>
                                                <Button
                                                      variant="destructive"
                                                      className="w-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 transition-all font-bold"
                                                      onClick={handleDeleteAccount}
                                                >
                                                      Delete My Account
                                                </Button>
                                          </CardContent>
                                    </Card>
                              </div>
                        </div>
                  </div>
            </div>
      );
}
