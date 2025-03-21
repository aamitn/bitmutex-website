import { getUserMeLoader } from "@/data/services/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { LogoutButton } from "@/components/custom/logout-button";
import CookieConsentControls from "@/components/cookie/CookieConsentApiControls";

export default async function DashboardRoute() {
  const response = await getUserMeLoader();
  const user = response.ok ? response.data : null;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500 text-lg">
        Error fetching user data.
      </div>
    );
  }

  console.log("User Data:", user); // Debugging

  return (
    <div className="mt-12 flex min-h-screen bg-muted">
      {/* Sidebar (Hidden on Mobile) */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-300 dark:border-gray-700 p-6 hidden md:block">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h2>
        <div className="mt-6 space-y-4">
          <button className="w-full py-2 text-center bg-gray-200 dark:bg-gray-700 rounded-md">Profile</button>
          <button className="w-full py-2 text-center bg-gray-200 dark:bg-gray-700 rounded-md">Settings</button>
          <LogoutButton />   
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Welcome, {user.firstname}!</h1>

        {/* User Profile Card */}
        <Card className="max-w-2xl">
          <CardHeader className="flex items-center space-x-4">
            {/* User Avatar */}
            <Avatar className="w-16 h-16">
              <AvatarImage src={user.image || ""} alt={user.firstname} />
              <AvatarFallback className="bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {user.firstname.charAt(0)}
                {user.lastname.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div>
              <CardTitle className="text-lg">{user.firstname} {user.lastname}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
            </div>
          </CardHeader>

          <CardContent>

          {/*  Badges for status*/}
          <Badge variant={user.confirmed ? "default" : "destructive"}>
            {user.confirmed ? "Verified" : "Unverified"}
          </Badge>

          {/* Fixed Badge Variant for Blocked User */}
          <Badge variant={user.blocked ? "destructive" : "outline"}>
            {user.blocked ? "Blocked" : "Active"}
          </Badge>


            {/* User Details Table */}
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Email</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">User ID</TableCell>
                  <TableCell>{user.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Document ID</TableCell>
                  <TableCell>{user.documentId}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Provider</TableCell>
                  <TableCell>{user.provider}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Created At</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleString()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Updated At</TableCell>
                  <TableCell>{new Date(user.updatedAt).toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Cookie Consent Section */}
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg">Cookie Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <CookieConsentControls />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
