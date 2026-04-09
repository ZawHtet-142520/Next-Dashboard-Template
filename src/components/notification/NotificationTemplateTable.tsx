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
import { formatDate } from "@/lib/formatDate";
import { NotificationTemplateItem } from "@/types/template";

interface NotificationTemplatesTableProps {
  templates: NotificationTemplateItem[];
  templatesResponseLoading: boolean;
  onEdit: (template: NotificationTemplateItem) => void;
}

export function NotificationTemplatesTable({
  templates,
  templatesResponseLoading,
  onEdit,
}: NotificationTemplatesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Templates ({templates.length})</CardTitle>
        <CardDescription>Current templates from the API</CardDescription>
      </CardHeader>
      <CardContent>
        {templatesResponseLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading templates...
          </div>
        ) : templates.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No templates found
          </div>
        ) : (
          <div className="space-y-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template._id}>
                    <TableCell>{template.subject || "-"}</TableCell>
                    <TableCell>
                      {template.createdAt
                        ? formatDate(template.createdAt)
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEdit(template)}
                        >
                          Edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
