"use client";

import { useCreateWebsite } from "@/queries/website/useCreateWebsite";
import { useDeleteWebsite } from "@/queries/website/useDeleteWebsite";
import { useOrganizations } from "@/queries/website/useOrganizations";
import { useUpdateWebsite } from "@/queries/website/useUpdateWebsite";
import { useUpdateWebsiteEmailSetting } from "@/queries/website/useUpdateWebsiteEmailSetting";
import { useWebsites } from "@/queries/website/useWebsites";
import {
  createWebsiteSchama,
  CreateWebsiteType,
} from "@/schemas/createWebsiteSchema";
import {
  updateWebsiteEmailSettingSchema,
  UpdateWebsiteEmailSettingType,
} from "@/schemas/updateWebsiteEmailSettingSchema";
import { WebsiteItem } from "@/types/website";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export function useWebsiteManagement() {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [createdAfter, setCreatedAfter] = useState("");
  const [createdBefore, setCreatedBefore] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [configureId, setConfigureId] = useState<string | null>(null);

  const [logoPreview, setLogoPreview] = useState("");
  const [editLogoPreview, setEditLogoPreview] = useState("");
  const [logoFile, setLogoFile] = useState<File | undefined>(undefined);
  const [editLogoFile, setEditLogoFile] = useState<File | undefined>(undefined);
  const [pendingDeleteWebsite, setPendingDeleteWebsite] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const openCreateWebsite = () => router.push("/dashboard/website/create");
  const closeCreateWebsite = () => router.push("/dashboard/website");
  const closeEditWebsite = () => router.push("/dashboard/website");
  const closeConfigure = () => router.push("/dashboard/website");

  const onSearchChange = (value: string) => {
    setSearch(value);
  };

  const onPageSizeChange = (nextLimit: number) => {
    setLimit(nextLimit);
    setPage(1);
  };

  const onCreatedAfterChange = (value: string) => {
    setCreatedAfter(value);
  };

  const onCreatedBeforeChange = (value: string) => {
    setCreatedBefore(value);
  };

  const clearFilters = () => {
    setSearch("");
    setPage(1);
    setCreatedAfter("");
    setCreatedBefore("");
  };

  const { data: websiteListResponse, isLoading: websiteListLoading } =
    useWebsites({
      page,
      limit,
      search: search || undefined,
      createdAfter: createdAfter || undefined,
      createdBefore: createdBefore || undefined,
    });
  const { data: organizationResponse } = useOrganizations();

  const createWebsiteMutation = useCreateWebsite();
  const updateWebsiteMutation = useUpdateWebsite();
  const deleteWebsiteMutation = useDeleteWebsite();
  const updateWebsiteEmailSettingMutatiion = useUpdateWebsiteEmailSetting();

  const websites = websiteListResponse?.data?.websites || [];
  const organizationOptions = organizationResponse?.data?.organizations || [];
  const pagination = websiteListResponse?.data?.pagination;
  const fileLocation = websiteListResponse?.data?.fileLocation.website || "";

  const createWebsiteForm = useForm<CreateWebsiteType>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      url: "",
      subject: "",
    },
    resolver: zodResolver(createWebsiteSchama),
  });

  const onCreateWebsite = async (data: CreateWebsiteType) => {
    try {
      const response = await createWebsiteMutation.mutateAsync({
        name: data.name,
        email: data.email,
        phone: data.phone,
        url: data.url,
        subject: data.subject,
        logo: logoFile,
        organization: data.organization,
      });
      createWebsiteForm.reset();
      closeCreateWebsite();
      toast.success(response?.message || "Website created successfully");
    } catch (error) {
      console.error("Failed to create website:", error);
      toast.error("Unable to create website");
    }
  };

  const toLogoPreviewUrl = (logo: string | null | undefined) => {
    if (!logo) return "";
    if (logo.startsWith("http://") || logo.startsWith("https://")) {
      return logo;
    }
    return `${fileLocation}${logo}`;
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

  const onLogoFileChange = (file: File | undefined) => {
    setLogoFile(file);
    if (!file) {
      setLogoPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setLogoPreview(objectUrl);
  };

  const onEditLogoFileChange = (file: File | undefined) => {
    setEditLogoFile(file);
    if (!file) {
      setEditLogoPreview("");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setEditLogoPreview(objectUrl);
  };

  const openDeleteConfirm = (website: WebsiteItem) => {
    setPendingDeleteWebsite({
      id: website._id,
      name: website.name || "Website",
    });
  };

  const closeDeleteConfirm = () => {
    if (deletingId) return;
    setPendingDeleteWebsite(null);
  };

  const confirmDeleteAdmin = async () => {
    if (!pendingDeleteWebsite) return;

    setDeletingId(pendingDeleteWebsite.id);
    try {
      const response = await deleteWebsiteMutation.mutateAsync(
        pendingDeleteWebsite.id,
      );
      toast.success(response?.message || "Website deleted successfully");
    } catch (error) {
      console.error("Failed to delete admin:", error);
      toast.error("Unable to delete admin");
    } finally {
      setDeletingId(null);
      setPendingDeleteWebsite(null);
    }
  };

  const editWebsiteForm = useForm<CreateWebsiteType>({
    resolver: zodResolver(createWebsiteSchama),
  });

  const openEditWebsite = (website: WebsiteItem) => {
    router.push(`/dashboard/website/edit/${website._id}`);
  };

  const onEditWebsite = async (data: CreateWebsiteType) => {
    if (!editId) {
      return toast.error("Invalid website id");
    }
    try {
      const response = await updateWebsiteMutation.mutateAsync({
        websiteId: editId,
        payload: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          url: data.url,
          subject: data.subject,
          logo: editLogoFile,
          organization: data.organization,
        },
      });
      closeEditWebsite();
      toast.success(response?.message || "Website updated successfully");
    } catch (error) {
      console.error("Failed to update website:", error);
      toast.error("Unable to update website");
    }
  };

  const configrueEmailSettingForm = useForm<UpdateWebsiteEmailSettingType>({
    resolver: zodResolver(updateWebsiteEmailSettingSchema),
    defaultValues: {
      host: "",
      port: 0,
      secure: true,
      authUser: "",
      authPass: "",
    },
  });

  const openConfigureWebsiteEmailSetting = async (website: WebsiteItem) => {
    router.push(`/dashboard/website/configure/${website._id}`);
  };

  const onConfigureWebsiteEmailSetting = async (
    emailSetting: UpdateWebsiteEmailSettingType,
  ) => {
    if (!configureId) {
      return toast.error("Invalid website id");
    }
    try {
      const response = await updateWebsiteEmailSettingMutatiion.mutateAsync({
        websiteId: configureId,
        payload: emailSetting,
      });
      closeConfigure();
      toast.success(response?.message || "Email setting updated successfully");
    } catch (error) {
      console.error("Failed to update email setting:", error);
      toast.error("Unable to update email settting");
    }
  };

  return {
    search,
    page,
    limit,
    createdAfter,
    createdBefore,
    pagination,
    websites,
    websiteListLoading,
    deletingId,
    isCreating: createWebsiteMutation.isPending,
    isEditing: updateWebsiteMutation.isPending,
    isConfiguring: updateWebsiteEmailSettingMutatiion.isPending,
    goToNextPage,
    goToPreviousPage,
    clearFilters,
    onPageSizeChange,
    onSearchChange,
    onCreatedAfterChange,
    onCreatedBeforeChange,
    openCreateWebsite,
    toLogoPreviewUrl,
    setPage,
    closeCreateWebsite,
    closeEditWebsite,
    createWebsiteForm,
    onCreateWebsite,
    logoPreview,
    onLogoFileChange,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDeleteAdmin,
    pendingDeleteWebsite,
    organizationOptions,
    openEditWebsite,
    editWebsiteForm,
    onEditWebsite,
    editLogoPreview,
    onEditLogoFileChange,
    configrueEmailSettingForm,
    openConfigureWebsiteEmailSetting,
    onConfigureWebsiteEmailSetting,
    configureId,
    closeConfigure,
    setEditId,
    setEditLogoFile,
    setEditLogoPreview,
    setConfigureId,
  };
}
