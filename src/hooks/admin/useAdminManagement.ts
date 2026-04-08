"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useAdmins,
  useCreateAdmin,
  useDeleteAdmin,
  useRoles,
  useUpdateAdmin,
} from "@/queries";
import { AdminItem } from "@/types/admin";

const getRoleId = (role: AdminItem["role"]): string => {
  if (!role) return "";
  if (typeof role === "string") return role;
  return role._id;
};

export function useAdminManagement() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [statusFilter, setStatusFilter] = useState("active");
  const [roleFilter, setRoleFilter] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDeleteAdmin, setPendingDeleteAdmin] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");

  const [editAdminId, setEditAdminId] = useState("");
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editProfileFile, setEditProfileFile] = useState<File | null>(null);
  const [editProfilePreview, setEditProfilePreview] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRoleId, setEditRoleId] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  const {
    data: adminsResponse,
    isLoading: adminsLoading,
    refetch: refetchAdmins,
  } = useAdmins({
    page,
    limit,
    status: statusFilter || undefined,
    role: roleFilter || undefined,
    search: debouncedSearch || undefined,
  });
  const { data: rolesResponse } = useRoles();

  const createAdminMutation = useCreateAdmin();
  const updateAdminMutation = useUpdateAdmin();
  const deleteAdminMutation = useDeleteAdmin();

  const admins = adminsResponse?.data?.admins ?? [];
  const pagination = adminsResponse?.data?.pagination;
  const roleOptions = rolesResponse?.data?.roles ?? [];
  const profileBaseUrl = adminsResponse?.data?.fileLocation?.admin || "";

  const toProfilePreviewUrl = (profile: string | null | undefined) => {
    if (!profile) return "";
    if (profile.startsWith("http://") || profile.startsWith("https://")) {
      return profile;
    }

    return `${profileBaseUrl}${profile}`;
  };

  const openCreateAdminModal = () => setOpenCreateModal(true);
  const closeCreateAdminModal = () => setOpenCreateModal(false);
  const closeEditAdminModal = () => setOpenEditModal(false);

  const onStatusFilterChange = (nextStatus: string) => {
    setStatusFilter(nextStatus);
    setPage(1);
  };

  const onRoleFilterChange = (nextRole: string) => {
    setRoleFilter(nextRole);
    setPage(1);
  };

  const onSearchChange = (value: string) => {
    setSearch(value);
  };

  const onPageSizeChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setRoleFilter("");
    setPage(1);
  };

  const goToPreviousPage = () => {
    setPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    const activeLimit = pagination?.limit || limit || 1;
    const totalPages = Math.max(
      1,
      Math.ceil((pagination?.totalCount || 0) / activeLimit),
    );
    setPage((prev) => Math.min(prev + 1, totalPages));
  };

  const resetCreateForm = () => {
    setName("");
    setEmail("");
    setProfileFile(null);
    setProfilePreview("");
    setPassword("");
    setRoleId("");
  };

  const onProfileFileChange = (file: File | null) => {
    setProfileFile(file);
    if (!file) {
      setProfilePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setProfilePreview(objectUrl);
  };

  const onEditProfileFileChange = (file: File | null) => {
    setEditProfileFile(file);
    if (!file) {
      setEditProfilePreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setEditProfilePreview(objectUrl);
  };

  const onCreateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password.trim() || !roleId) {
      toast.error("Name, email, password, and role are required");
      return;
    }

    try {
      const response = await createAdminMutation.mutateAsync({
        username: name.trim(),
        email: email.trim(),
        profile: profileFile,
        password,
        role: roleId,
      });

      await refetchAdmins();
      resetCreateForm();
      setOpenCreateModal(false);
      toast.success(response?.message || "Admin created successfully");
    } catch (error) {
      console.error("Failed to create admin:", error);
      toast.error("Unable to create admin");
    }
  };

  const openEditModalForAdmin = (admin: AdminItem) => {
    setEditAdminId(admin._id);
    setEditName(admin.username || admin.name || "");
    setEditEmail(admin.email || "");
    setEditProfileFile(null);
    setEditProfilePreview(toProfilePreviewUrl(admin.profile));
    setEditPassword("");
    setEditRoleId(getRoleId(admin.role));
    setOpenEditModal(true);
  };

  const onUpdateAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editAdminId) {
      toast.error("Invalid admin id");
      return;
    }

    if (!editName.trim() || !editEmail.trim() || !editRoleId) {
      toast.error("Name, email, and role are required");
      return;
    }

    try {
      const response = await updateAdminMutation.mutateAsync({
        adminId: editAdminId,
        payload: {
          username: editName.trim(),
          email: editEmail.trim(),
          profile: editProfileFile,
          role: editRoleId,
          ...(editPassword.trim() ? { password: editPassword } : {}),
        },
      });

      await refetchAdmins();
      setOpenEditModal(false);
      toast.success(response?.message || "Admin updated successfully");
    } catch (error) {
      console.error("Failed to update admin:", error);
      toast.error("Unable to update admin");
    }
  };

  const openDeleteConfirm = (admin: AdminItem) => {
    setPendingDeleteAdmin({
      id: admin._id,
      name: admin.username || admin.name || "Admin",
    });
  };

  const closeDeleteConfirm = () => {
    if (deletingId) return;
    setPendingDeleteAdmin(null);
  };

  const confirmDeleteAdmin = async () => {
    if (!pendingDeleteAdmin) return;

    setDeletingId(pendingDeleteAdmin.id);
    try {
      const response = await deleteAdminMutation.mutateAsync(
        pendingDeleteAdmin.id,
      );
      await refetchAdmins();
      toast.success(response?.message || "Admin deleted successfully");
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error("Unable to delete admin");
    } finally {
      setDeletingId(null);
      setPendingDeleteAdmin(null);
    }
  };

  return {
    admins,
    adminsLoading,
    pagination,
    page,
    limit,
    statusFilter,
    roleFilter,
    search,
    deletingId,
    openCreateModal,
    openEditModal,
    pendingDeleteAdmin,
    roleOptions,
    name,
    email,
    profilePreview,
    password,
    roleId,
    editName,
    editEmail,
    editProfilePreview,
    editPassword,
    editRoleId,
    isCreating: createAdminMutation.isPending,
    isUpdating: updateAdminMutation.isPending,
    openCreateAdminModal,
    closeCreateAdminModal,
    closeEditAdminModal,
    onStatusFilterChange,
    onRoleFilterChange,
    onSearchChange,
    onPageSizeChange,
    clearFilters,
    setPage,
    goToPreviousPage,
    goToNextPage,
    refreshAdmins: () => {
      refetchAdmins();
    },
    setName,
    setEmail,
    onProfileFileChange,
    setPassword,
    setRoleId,
    setEditName,
    setEditEmail,
    onEditProfileFileChange,
    setEditPassword,
    setEditRoleId,
    onCreateAdmin,
    openEditModalForAdmin,
    onUpdateAdmin,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteAdmin,
  };
}
