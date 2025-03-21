import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL,
  process.env.NEXT_PUBLIC_SUPABASE_API_KEY
);

export async function uploadFile(file) {
  const { data, error } = await supabase.storage
    .from("exclutch-files")
    .upload("/uploads/" + uuidv4(), file);

  if (data) {
    return data;
  }
}

export async function getPublicFileUrl(id) {
  const { data } = supabase.storage.from("exclutch-files").getPublicUrl(id);
  console.log(data);
  
  if (data) {
    return data;
  }
}

export async function removeFile(id) {
  const { error, data } = await supabase.storage
    .from("exclutch-files")
    .remove(id);
  
    if (data) {
        return data;
      }
}
