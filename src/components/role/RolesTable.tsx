"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Role } from "@/types/role";
import { formatDate } from "@/lib/formatDate";

interface RolesTableProps {
  roles: Role[];
  rolesLoading: boolean;
  deletingId: string | null;
  onEdit: (roleId: string) => void;
  onDelete: (role: Role) => void;
}

export function RolesTable({
  roles,
  rolesLoading,
  deletingId,
  onEdit,
  onDelete,
}: RolesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Roles ({roles.length})</CardTitle>
        <CardDescription>Current roles from the API</CardDescription>
      </CardHeader>
      <CardContent>
        {rolesLoading ? (
          <div className="text-sm text-muted-foreground">Loading roles...</div>
        ) : roles.length === 0 ? (
          <div className="text-sm text-muted-foreground">No roles found</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role._id}>
                  <TableCell className="whitespace-normal">
                    <div className="font-medium">{role.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {role.description || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="capitalize">{role.type}</TableCell>
                  <TableCell>{role.permissions?.length || 0}</TableCell>
                  <TableCell>
                    {role.createdAt ? formatDate(role.createdAt) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={role.type === "system"}
                        onClick={() => onEdit(role._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-400"
                        disabled={
                          deletingId === role._id || role.type === "system"
                        }
                        onClick={() => onDelete(role)}
                      >
                        {deletingId === role._id ? "Deleting..." : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
