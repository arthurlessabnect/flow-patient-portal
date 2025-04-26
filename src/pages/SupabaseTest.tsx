
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/layouts/MainLayout";

export default function SupabaseTest() {
  const [status, setStatus] = useState<string>("Checking connection...");
  const [projectRef, setProjectRef] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Test the Supabase connection by making a simple query
        const { data, error } = await supabase.from("nutritionists").select("count(*)");
        
        if (error) throw error;
        
        // Extract project ref from the URL stored in environment variables
        // Access the URL directly from the imported client file constants
        const url = "https://zholpfbdnolgiokwfwix.supabase.co";
        const ref = url.split("//")[1].split(".")[0];
        
        setProjectRef(ref);
        setStatus("Connected successfully!");
      } catch (error: any) {
        console.error("Supabase connection error:", error);
        setStatus(`Connection failed: ${error.message || "Unknown error"}`);
      }
    }
    
    checkConnection();
  }, []);

  return (
    <MainLayout title="Supabase Connection Test">
      <div className="max-w-md mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Supabase Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="font-medium mb-1">Status:</h3>
                <p className={status.includes("success") ? "text-green-600" : status.includes("failed") ? "text-red-600" : "text-yellow-600"}>
                  {status}
                </p>
              </div>
              
              {projectRef && (
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-1">Project Reference:</h3>
                  <code className="bg-gray-100 px-2 py-1 rounded">{projectRef}</code>
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                This page tests the connection to your Supabase project.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
