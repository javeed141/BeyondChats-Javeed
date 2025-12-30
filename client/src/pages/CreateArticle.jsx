import { useState } from "react";
import api from "@/api/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Spinner from "@/components/Spinner";
import { useNavigate } from "react-router-dom";

export default function CreateArticle() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    url: "",
    content: ""
  });

  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!form.title.trim()) {
      toast.warning("Title is required");
      return;
    }

    setSaving(true);
    try {
      await api.post("/articles", form);
      toast.success("Article created");
      navigate("/articles");
    } catch (err) {
      toast.error("Creation failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-semibold text-foreground">
          Create Article
        </h1>
        <p className="text-sm text-muted-foreground">
          Add a new article to your workspace
        </p>
      </header>

      {/* Form */}
      <div
        className="max-w-2xl card-base space-y-4"
        style={{ borderLeft: "4px solid rgb(var(--primary))" }}
      >
        <Input
          placeholder="Title *"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <Input
          placeholder="Author"
          value={form.author}
          onChange={(e) =>
            setForm({ ...form, author: e.target.value })
          }
        />

        <Input
          placeholder="Source URL"
          value={form.url}
          onChange={(e) =>
            setForm({ ...form, url: e.target.value })
          }
        />

        {/* Content textarea */}
        <textarea
          placeholder="Article content (original)"
          className="
            w-full min-h-[180px] rounded-md border border-input
            bg-background px-3 py-2 text-sm text-foreground
            placeholder:text-muted-foreground
            focus-visible:outline-none focus-visible:ring-2
            focus-visible:ring-ring
          "
          value={form.content}
          onChange={(e) =>
            setForm({ ...form, content: e.target.value })
          }
        />

        <div className="flex justify-end">
          <Button onClick={submit} disabled={saving}>
            {saving ? <Spinner label="Creating..." /> : "Create Article"}
          </Button>
        </div>
      </div>
    </div>
  );
}
