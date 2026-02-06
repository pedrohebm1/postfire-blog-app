"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ImageCropper from "./cropper";

interface AccountSectionProps {
  user: any;
}

export default function AccountSection({ user }: AccountSectionProps) {
  const router = useRouter();
  const [bio, setBio] = useState(user.bio || "");
  const [picture, setPicture] = useState<File | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);

  const [picturePreview, setPicturePreview] = useState<string | null>(
    user.picture
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(
    user.userBanner
  );

  const [socialGithub, setSocialGithub] = useState<string>(
    user.socialGithub || ""
  );
  const [socialTwitter, setSocialTwitter] = useState<string>(
    user.socialTwitter || ""
  );
  const [socialInstagram, setSocialInstagram] = useState<string>(
    user.socialInstagram || ""
  );
  const [socialWebsite, setSocialWebsite] = useState<string>(
    user.socialWebsite || ""
  );

  const [croppingImageUrl, setCroppingImageUrl] = useState<string | null>("");
  const [croppingImage, setCroppingImage] = useState<File | null>(null);
  const [croppingImageAspect, setCroppingImageAspect] = useState<number | null>(
    null
  );
  const [croppingImageCategory, setCroppingImageCategory] = useState<
    "picture" | "banner" | null
  >(null);
  const [croppingShape, setCroppingShape] = useState<"rect" | "round">("rect");

  const [isFetching, setIsFetching] = useState(false);

  const initialState = {
    bio: user.bio || "",
    picture: user.picture || null,
    bannerImage: user.userBanner || null,
    socialGithub: user.socialGithub || "",
    socialWebsite: user.socialWebsite || "",
    socialInstagram: user.socialInstagram || "",
    socialTwitter: user.socialTwitter || "",
  };

  useEffect(() => {
    if (bannerImage) {
      const fileURL = URL.createObjectURL(bannerImage);
      setBannerPreview(fileURL);

      return () => URL.revokeObjectURL(fileURL);
    }
  }, [bannerImage]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!isFetching) {
      setIsFetching(true);

      const formData = new FormData();

      if (bio !== initialState.bio) formData.append("bio", bio);
      if (socialGithub !== initialState.socialGithub)
        formData.append("socialgithub", socialGithub);
      if (socialWebsite !== initialState.socialWebsite)
        formData.append("socialwebsite", socialWebsite);
      if (socialTwitter !== initialState.socialTwitter)
        formData.append("socialtwitter", socialTwitter);
      if (socialInstagram !== initialState.socialInstagram)
        formData.append("socialinstagram", socialInstagram);
      if (picture) formData.append("picture", picture);
      if (bannerImage) formData.append("bannerimage", bannerImage);

      fetch("/api/user/editinfo", {
        method: "POST",
        body: formData,
      })
        .then((res) => {
          if (res.status === 401) {
            router.push("/signin");
            return false;
          }
          if (res.status === 400) {
            return false;
          }
          return res.json();
        })
        .then((data: any) => {
          if (data) {
            window.location.href = `/users/${user.id}`;
          }
        })
        .catch((error) => {
          console.error(error.message);
        })
        .finally(() => {
          setIsFetching(false);
        });
    }
  }

  function handleCroppedImage(file: File) {
    if (croppingImageCategory === "picture") {
      setPicture(file);
      setPicturePreview(URL.createObjectURL(file));
      handleCloseCropper();
    }
    if (croppingImageCategory === "banner") {
      setBannerImage(file);
      setBannerPreview(URL.createObjectURL(file));
      handleCloseCropper();
    }
  }

  function removePhoto(typeSelected: "picture" | "banner") {
    if (typeSelected === "picture") {
      setPicture(null);
      setPicturePreview(null);
    }
    if (typeSelected === "banner") {
      setBannerImage(null);
      setBannerPreview(null);
    }
  }

  function handleCloseCropper() {
    setCroppingImage(null);
    setCroppingImageAspect(null);
    setCroppingImageCategory(null);
    setCroppingImageUrl(null);
  }

  function handleChange(e: React.FormEvent<HTMLInputElement>) {
    const fileInput = e.currentTarget.files![0];

    const VALID_FILE_TYPES = ["image/jpeg", "image/png"];
    if (fileInput) {
      if (!VALID_FILE_TYPES.includes(fileInput.type)) {
        alert("Invalid file type. Please select a JPG or PNG image.");
        return;
      }
      try {
        if (e.currentTarget.name === "picture") {
          setCroppingImage(fileInput);
          setCroppingImageUrl(URL.createObjectURL(fileInput));
          setCroppingImageCategory("picture");
          setCroppingImageAspect(4 / 4);
          setCroppingShape("round");
        } else if (e.currentTarget.name === "banner") {
          setCroppingImage(fileInput);
          setCroppingImageUrl(URL.createObjectURL(fileInput));
          setCroppingImageCategory("banner");
          setCroppingImageAspect(1200 / 600);
          setCroppingShape("rect");
        }

        e.currentTarget.value = "";
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="w-full px-4 lg:px-0">
      <form onSubmit={onSubmit}>
        <h1 className="text-4xl">Profile Account</h1>
        <p className="text-lg mt-2 mb-10">
          Manage your Postfire account profile. Any changes you make will be
          applied and visible to visitors.
        </p>
        <div className="flex flex-col md:flex-row gap-10">
          <div className="w-full md:w-1/2 flex flex-col items-center gap-5">
            <h2 className="self-start text-2xl">Profile Picture</h2>
            <div className="w-40 h-40 rounded-full overflow-hidden">
              <img
                className="w-40 h-40 object-cover"
                src={
                  picturePreview ? picturePreview : "/static/images/perfil.png"
                }
                alt="Profile"
              />
            </div>
            <label className="border-1 px-8 rounded-md text-center py-3 text-bs border-black cursor-pointer">
              <input
                className="hidden"
                name="picture"
                onChange={handleChange}
                type="file"
                accept="image/*"
              />
              Upload photo
            </label>
          </div>

          <div className="w-full md:w-1/2 flex flex-col items-center gap-5">
            <h2 className="self-start text-2xl">Banner Image</h2>
            <div className="w-full md:w-60 rounded-md overflow-hidden">
              <img
                className="w-full h-40 object-cover"
                src={bannerPreview ? bannerPreview : ""}
                alt="Banner"
              />
            </div>
            <div className="flex flex-row gap-4">
              <label className="border-1 px-8 rounded-md text-center py-3 text-bs border-black cursor-pointer">
                <input
                  className="hidden"
                  name="banner"
                  onChange={handleChange}
                  type="file"
                />
                Upload photo
              </label>
            </div>
          </div>
        </div>
        {croppingImage && (
          <ImageCropper
            onCropComplete={handleCroppedImage}
            imageFile={croppingImage}
            imageFileUrl={croppingImageUrl}
            aspect={croppingImageAspect}
            onCancel={handleCloseCropper}
            cropShape={croppingShape}
          />
        )}
        <h2 className="text-2xl mt-10">Social links</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-x-10">
          <label className="block mt-5">
            <span className="text-lg">Twitter:</span>
            <input
              className="w-full mt-2 p-2 border rounded-md resize-none"
              name="twitter"
              value={socialTwitter || ""}
              onChange={(e) => setSocialTwitter(e.target.value)}
              placeholder="https://twitter.com/yourusername"
            />
          </label>
          <label className="block mt-5">
            <span className="text-lg">Instagram:</span>
            <input
              className="w-full mt-2 p-2 border rounded-md resize-none"
              name="instagram"
              value={socialInstagram || ""}
              onChange={(e) => setSocialInstagram(e.target.value)}
              placeholder="https://instagram.com/yourusername"
            />
          </label>
          <label className="block mt-5">
            <span className="text-lg">Website:</span>
            <input
              className="w-full mt-2 p-2 border rounded-md resize-none"
              name="website"
              value={socialWebsite || ""}
              onChange={(e) => setSocialWebsite(e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </label>
          <label className="block mt-5">
            <span className="text-lg">Github:</span>
            <input
              className="w-full mt-2 p-2 border rounded-md resize-none"
              name="github"
              value={socialGithub || ""}
              onChange={(e) => setSocialGithub(e.target.value)}
              placeholder="https://github.com/yourusername"
            />
          </label>
        </section>
        <label className="block mt-10">
          <span className="text-2xl mt-10">About you</span>
          <textarea
            className="w-full mt-2 p-2 border rounded-md resize-none h-52"
            name="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us about yourself..."
          />
        </label>
        <button
          className="flex flex-row gap-5 px-3 border-2 rounded-md bg-zinc-900 text-white outline outline-1 text-xs py-2 my-5 relative m-auto"
          type="submit"
        >
          <span className="text-xs">Save changes</span>
          <img
            className="w-4 invert"
            src="/static/images/save.svg"
            alt="Save"
          />
        </button>
      </form>
    </div>
  );
}
