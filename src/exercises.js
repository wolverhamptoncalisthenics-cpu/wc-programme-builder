import { supabase } from "./supabase";

export async function fetchExerciseNames() {
  const { data, error } = await supabase.from("exercise_library").select("name").order("name");
  if (error) return [];
  return data.map((row) => row.name);
}

export async function addExerciseName(name) {
  return supabase.from("exercise_library").insert({ name: name.trim() });
}
