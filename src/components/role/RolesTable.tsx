"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Role } from "@/types/role";
import { formatDate } from "@/lib/formatDate";

interface RolesTableProps {
  roles: Role[];
  rolesLoading: boolean;
  deletingId: string | null;
  onEdit: (role: Role) => void;
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-2">Name</th>
                  <th className="py-2">Type</th>
                  <th className="py-2">Permissions</th>
                  <th className="py-2">Created At</th>
                  <th className="py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role._id} className="border-b">
                    <td className="py-2 pr-3">
                      <div className="font-medium">{role.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {role.description || "-"}
                      </div>
                    </td>
                    <td className="py-2 pr-3 capitalize">{role.type}</td>
                    <td className="py-2 pr-3">
                      {role.permissions?.length || 0}
                    </td>
                    <td className="py-2 pr-3">
                      {role.createdAt ? formatDate(role.createdAt) : "-"}
                    </td>
                    <td className="py-2 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={role.type === "system"}
                          onClick={() => onEdit(role)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={
                            deletingId === role._id || role.type === "system"
                          }
                          onClick={() => onDelete(role)}
                        >
                          {deletingId === role._id ? "Deleting..." : "Delete"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
