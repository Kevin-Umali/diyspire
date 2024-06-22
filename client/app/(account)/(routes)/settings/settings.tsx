"use client";

import withAuth from "@/hocs/withAuth";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function Settings() {
  return (
    <>
      <div className="flex flex-col">
        <h1 className="mb-1 text-3xl font-semibold lg:text-4xl">Settings</h1>
        <Label className="text-md mb-5 mt-2 block text-sm">Manage your application settings.</Label>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="flex w-full flex-1 flex-col">
          <Tabs defaultValue="profile">
            <div className="flex items-center">
              <TabsList>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="diy">DIY Projects</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="profile">
              <div className="grid gap-6">
                <Card className="border bg-transparent">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your profile information.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="flex flex-col gap-4">
                      <Input placeholder="Username" className="mb-4" />
                      <Input placeholder="Email Address" className="mb-4" />
                      <Input placeholder="Full Name" />
                    </form>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button>Save</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="notifications">
              <div className="grid gap-6">
                <Card className="border bg-transparent">
                  <CardHeader>
                    <CardTitle>Email Notifications</CardTitle>
                    <CardDescription>Manage your email notification preferences.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="flex flex-col gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="newsletter" />
                        <label htmlFor="newsletter" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Receive newsletter
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="updates" />
                        <label htmlFor="updates" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Receive updates
                        </label>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button>Save</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="privacy">
              <div className="grid gap-6">
                <Card className="border bg-transparent">
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>Manage your privacy settings.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="flex flex-col gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="profileVisibility" />
                        <label htmlFor="profileVisibility" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Make profile visible
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="searchEngineIndexing" />
                        <label htmlFor="searchEngineIndexing" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Allow search engines to index my profile
                        </label>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button>Save</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="password">
              <div className="grid gap-6">
                <Card className="border bg-transparent">
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your account password.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="flex flex-col gap-4">
                      <Input type="password" placeholder="Current Password" className="mb-4" />
                      <Input type="password" placeholder="New Password" className="mb-4" />
                      <Input type="password" placeholder="Confirm New Password" />
                    </form>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button>Save</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="diy">
              <div className="grid gap-6">
                <Card className="border bg-transparent">
                  <CardHeader>
                    <CardTitle>Favorite Projects</CardTitle>
                    <CardDescription>Manage your favorite DIY projects.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="flex flex-col gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="project1" />
                        <label htmlFor="project1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Project 1
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="project2" />
                        <label htmlFor="project2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Project 2
                        </label>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button>Save</Button>
                  </CardFooter>
                </Card>
                <Card className="border bg-transparent">
                  <CardHeader>
                    <CardTitle>Project Categories</CardTitle>
                    <CardDescription>Manage the categories of your DIY projects.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="flex flex-col gap-4">
                      <Input placeholder="Add New Category" className="mb-4" />
                      <div className="flex items-center space-x-2">
                        <Checkbox id="category1" />
                        <label htmlFor="category1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Category 1
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="category2" />
                        <label htmlFor="category2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Category 2
                        </label>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button>Save</Button>
                  </CardFooter>
                </Card>
                <Card className="border bg-transparent">
                  <CardHeader>
                    <CardTitle>Recommendations</CardTitle>
                    <CardDescription>Customize your DIY project recommendations.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="flex flex-col gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="recommendations" />
                        <label htmlFor="recommendations" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          Receive personalized recommendations
                        </label>
                      </div>
                    </form>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4">
                    <Button>Save</Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}

export default withAuth(Settings);
