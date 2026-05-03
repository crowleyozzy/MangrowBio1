import { getPrisma } from "@/lib/prisma";
import { ApiError } from "@/backend/utils/errors";
import { validateBlogInput } from "@/backend/utils/validation";

export async function listBlogPosts() {
  const prisma = getPrisma();
  const posts = await prisma.blogPost.findMany({
    orderBy: [{ created_at: "desc" }],
  });
  return { posts };
}

export async function getBlogBySlug(slug: string) {
  const prisma = getPrisma();
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) throw new ApiError(404, "Blog post not found");
  return { post };
}

export async function createBlogPost(rawBody: Record<string, unknown>) {
  const payload = validateBlogInput(rawBody);
  const prisma = getPrisma();
  const post = await prisma.blogPost.create({ data: payload });
  return { success: true, post };
}

export async function updateBlogBySlug(slug: string, rawBody: Record<string, unknown>) {
  const payload = validateBlogInput(rawBody);
  const prisma = getPrisma();
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (!existing) throw new ApiError(404, "Blog post not found");
  const post = await prisma.blogPost.update({
    where: { slug },
    data: payload,
  });
  return { success: true, post };
}

export async function deleteBlogBySlug(slug: string) {
  const prisma = getPrisma();
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (!existing) throw new ApiError(404, "Blog post not found");
  await prisma.blogPost.delete({ where: { slug } });
  return { success: true };
}
