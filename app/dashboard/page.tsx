'use client';

import { LinkList } from '@/components/dashboard/link-list';
import { CreateLinkForm } from '@/components/dashboard/create-link-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <Tabs defaultValue="links">
        <TabsList>
          <TabsTrigger value="links">Public Links</TabsTrigger>
          <TabsTrigger value="create">Create New Link</TabsTrigger>
        </TabsList>
        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Public Links</CardTitle>
            </CardHeader>
            <CardContent>
              <LinkList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create Public Link</CardTitle>
            </CardHeader>
            <CardContent>
              <CreateLinkForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}