"use server";

import { redirect } from "next/navigation";

import { storePost } from "@/lib/posts";
import { uploadImage } from "@/lib/cloudinary";

export async function createPost(prevState, formData) {
  // prevState is necessery for use!!! Don't delete it!
  const title = formData.get("title");
  const image = formData.get("image");
  const content = formData.get("content");

  let errors = [];

  if (!title || title.trim().length === 0) {
    errors.push("Title is required");
  }
  if (!content || content.trim().length === 0) {
    errors.push("Content is required");
  }
  if (!image || image.size === 0) {
    errors.push("Image is required");
  }

  if (errors.length > 0) {
    return { errors };
  }

  let imageUrl;
  try {
    imageUrl = await uploadImage(image);
  } catch (error) {
    throw new Error(
      "Image upload failed. Post was not created. Please try again later"
    );
  }

  try {
    await storePost({
      imageUrl: imageUrl,
      title,
      content,
      userId: 1,
    });
  } catch (error) {
    throw new Error(
      "Creating new post failed. Post was not created. Please try again later"
    );
  }

  redirect("/feed");
}
