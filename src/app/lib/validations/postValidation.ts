interface BlogPost {
  title: string | null;
  summary: string | null;
  content: string | null;
  bannerImage?: File | null;
}

const VALID_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

function getTextContentLength(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  return text.trim().length;
}

export default function postValidation(blogPost: BlogPost) {
  try {
    let errors: string[] = [];

    if (!blogPost.title || blogPost.title.trim() === "") {
      errors.push("Title is required.");
    } else if (blogPost.title.length > 70) {
      errors.push("Title must be less than 70 characters.");
    }

    if (!blogPost.content || blogPost.content.trim() === "") {
      errors.push("Content is required.");
    } else if (getTextContentLength(blogPost.content) < 30) {
      errors.push(
        "Content must be at least 30 characters."
      );
    }

    if (blogPost.bannerImage) {
      const file = blogPost.bannerImage as File;

      if (!VALID_FILE_TYPES.includes(file.type)) {
        errors.push("Invalid file type. Only JPEG, PNG, and GIF are allowed.");
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        errors.push(`File size must be less than ${MAX_FILE_SIZE_MB}MB.`);
      }
    }

    return { valid: errors.length === 0, errors };
  } catch (error) {
    console.error("Error during validation:", error);
    return { valid: false, errors: ["An unexpected error occurred."] };
  }
}
