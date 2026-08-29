"use client";
import LexicalEditor from "../LexicalEditor";
import ToggleButton from "../ui/togglebutton";

const Settings = {
  image: {
    minwidth: 600,
    minheight: 300,
    maxwidth: 12000,
    maxheight: 6000,
    maxsize: 5000000,
    acceptables: ["image/jpeg", "image/png", "image/webp"], 
  }
}

export default function Form({ state, setState }: any) {
  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const fileInput = e.currentTarget.files![0];

    if (fileInput) {
      if (!Settings.image.acceptables.includes(fileInput.type)) {
        alert("Invalid file type. Please select a JPG, PNG, or GIF image.");
        return;
      }
      if (fileInput.size > Settings.image.maxsize) {
        alert("File size too large. Please select a file under 5MB.");
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          if (img.width < Settings.image.minwidth || img.height < Settings.image.minheight) {
            alert(
              `Image dimensions too small. Minimum dimensions are ${Settings.image.minwidth}x${Settings.image.minheight}.`
            );
            return;
          }
          if (img.width > Settings.image.maxwidth || img.height > Settings.image.maxheight) {
            alert(
              `Image dimensions too large. Maximum dimensions are ${Settings.image.maxwidth}x${Settings.image.maxheight}.`
            );
            return;
          }

          try {
            const fileURL = URL.createObjectURL(fileInput);
            setState((prev: any) => ({
              ...prev,
              bannerImage: fileInput,
              previewImage: fileURL,
            }));
          } catch (error) {
            console.error(error);
          }
        };

        if (event.target) {
          img.src = event.target.result as string;
        }
      };

      reader.readAsDataURL(fileInput);
    }
  };

  const clearFile = () => {
    setState((prev: any) => ({
      ...prev,
      bannerImage: null,
      previewImage: null,
    }));
  };

  const updateField = (field: string, value: any) => {
  setState((prev: any) => ({
    ...prev,
    [field]: value,
  }));
};

  return (
    <div className="flex flex-col items-center">
      <section className="flex flex-col-reverse xl:flex-row w-full gap-4 h-auto xl:h-52">
        <div className="flex xl:w-4/5 flex-col gap-4 w-full">
          <input
            className="outline text-xl outline-1 outline-slate-200 rounded-md py-3 px-3 placeholder:italic"
            type="text"
            name="title"
            placeholder="What’s your story called?"
            value={state.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
          <textarea
            className="outline text-lg outline-1 outline-slate-200 rounded-md py-3 px-3 h-40 resize-none placeholder:italic"
            placeholder="Give a sneak peek of what’s inside..."
            value={state.summary}
            onChange={(e) => updateField("summary", e.target.value)}
          />
        </div>

        <div className="flex flex-col outline outline-1 xl:w-2/5 h-full w-full outline-slate-200 rounded-md py-1 px-2">
          <p className="px-2 py-2 text-lg">Banner image</p>
          {state.bannerImage === null && (
            <div className="relative outline-dotted outline-2 text-xl w-full self-center outline-zinc-800 opacity-90 h-36 rounded-md">
              <input
                id="file-upload"
                type="file"
                name="banner"
                className="hidden"
                onChange={handleChange}
              />

              <div className="flex flex-col mt-2 items-center justify-center m-auto h-full">
                <img
                  src="/static/images/imageadd.png"
                  width={60}
                  height={60}
                  alt="Insert icons created by Smashicons - Flaticon"
                />
                <div>
                  <p className="text-sm">
                    Drag & Drop or{" "}
                    <label
                      htmlFor="file-upload"
                      className="text-blue-700 cursor-pointer underline hover:text-blue-500"
                    >
                      Choose file
                    </label>{" "}
                    here
                  </p>
                  <p className="text-xxs text-center m-0">
                    JPEG, PNG or GIF. Max size: 5MB.
                  </p>
                </div>
              </div>
            </div>
          )}
          {state.bannerImage !== null && (
            <div className="flex justify-center w-full h-full overflow-hidden gap-2 relative px-20 py-10 xl:px-0 xl:py-0">
              <img
                src={state.previewImage || ""}
                className="max-w-full max-h-full object-contain"
                alt="Banner preview"
              />
              <button
                className="absolute top-1 right-1 outline outline-1 outline-slate-300 rounded leading-4 bg-gray-200 h-5 w-5"
                type="button"
                onClick={clearFile}
              >
                x
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="my-4 w-full">
        <LexicalEditor
          value={state.content}
          onChange={(html) => updateField("content", html)}
        />

      </section>

      <div className="flex flex-col w-full items-center">
        <span>Allow comments</span>
        <ToggleButton
          state={state.allowComments}
          setState={(val: any) => updateField("allowComments", val)}
        />
      </div>
    </div>
  );
}
