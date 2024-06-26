/*
Super simple persistance layer.

Only use it if the user explicitly asks for data persistance.

Make sure that it is clear what schema each key has, and that the schema is consistent across the code.
If it is not, start by stating what the schema is before writing code to use this SDK in comments or reasoning.

Exact schema of the objects table:
[
  {
    "column_name": "id",
    "data_type": "bigint",
    "is_nullable": "NO"
  },
  {
    "column_name": "created_at",
    "data_type": "timestamp with time zone",
    "is_nullable": "NO"
  },
  {
    "column_name": "key",
    "data_type": "text",
    "is_nullable": "NO"
  },
  {
    "column_name": "value",
    "data_type": "jsonb",
    "is_nullable": "YES"
  },
  {
    "column_name": "project_id",
    "data_type": "text",
    "is_nullable": "NO"
  },
]

Example usage:

import { client } from 'lib/crud';

class User {
    constructor(name, age) {
        this.name = name
        this.age = age
    }
    }
}

client.set('user:anton_osika', { name: 'Anton Osika', age: 33 })
client.set('user:john_doe', { name: 'John Doe', age: 25 })
client.get('user:anton_osika').then(data => {
    const user = new User(data.name, data.age)
    console.log(user)
})
client.getWithPrefix('user:').then(data => {
    for (const obj of data) {
        console.log(obj.key, obj.value)
    }
})
client.delete('user:anton_osika')

*/

import { createClient } from "@supabase/supabase-js";
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3ZnZtbnlsZHdyaGN2eGRyZmR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTcxMjIwMzIsImV4cCI6MjAzMjY5ODAzMn0.p-g_isByyrQ8-M6xIuNT6Mzswgs1VmrFq2wjmQ_4Quc";
const projectId = process.env.VITE_PROJECT_ID;

const supabase = createClient(supabaseUrl, supabaseKey);

// pay attention to how the client works:
export const client = {
  get: async (key) => {
    const { data, error } = await supabase.from("objects").select("value").eq("project_id", projectId).eq("key", key);

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  },
  set: async (key, value) => {
    const { error } = await supabase.from("objects").upsert({ project_id: projectId, key, value });

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  },
  delete: async (key) => {
    const { error } = await supabase.from("objects").delete().eq("project_id", projectId).eq("key", key);

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  },
  getWithPrefix: async (prefix) => {
    // returns both key and value
    const { data, error } = await supabase.from("objects").select("key, value").eq("project_id", projectId).like("key", `${prefix}%`);

    if (error) {
      console.error(error);
      return null;
    }

    return data;
  },
};
