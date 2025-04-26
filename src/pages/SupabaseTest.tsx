
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MainLayout } from "@/layouts/MainLayout";

export default function SupabaseTest() {
  const [status, setStatus] = useState<string>("Checking connection...");
  const [projectRef, setProjectRef] = useState<string | null>(null);
  const [tablesInfo, setTablesInfo] = useState<any[]>([]);

  useEffect(() => {
    async function checkConnection() {
      try {
        // Test the Supabase connection with a simpler query
        const { data, error } = await supabase.from("nutritionists").select("id").limit(1);
        
        if (error) throw error;
        
        // Extract project ref from the URL
        const url = "https://zholpfbdnolgiokwfwix.supabase.co";
        const ref = url.split("//")[1].split(".")[0];
        
        setProjectRef(ref);
        setStatus("Connected successfully!");
        
        // Fetch tables information
        await fetchTablesInfo();
      } catch (error: any) {
        console.error("Supabase connection error:", error);
        setStatus(`Connection failed: ${error.message || "Unknown error"}`);
      }
    }
    
    async function fetchTablesInfo() {
      try {
        // Get some sample data from key tables to verify DB structure
        const tablesData = [];
        
        const { data: nutritionistsData, error: nutritionistsError } = 
          await supabase.from("nutritionists").select("count").maybeSingle();
        
        const { data: patientsData, error: patientsError } = 
          await supabase.from("patients").select("count").maybeSingle();
        
        const { data: dietsData, error: dietsError } = 
          await supabase.from("diets").select("count").maybeSingle();
        
        tablesData.push({
          name: "nutritionists",
          status: nutritionistsError ? "Error" : "Available",
          count: nutritionistsData?.count || 0,
          error: nutritionistsError?.message
        });
        
        tablesData.push({
          name: "patients",
          status: patientsError ? "Error" : "Available",
          count: patientsData?.count || 0,
          error: patientsError?.message
        });
        
        tablesData.push({
          name: "diets",
          status: dietsError ? "Error" : "Available",
          count: dietsData?.count || 0,
          error: dietsError?.message
        });
        
        setTablesInfo(tablesData);
      } catch (error: any) {
        console.error("Error fetching tables info:", error);
      }
    }
    
    checkConnection();
  }, []);

  return (
    <MainLayout title="Supabase Connection Test">
      <div className="max-w-2xl mx-auto mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Supabase Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
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
              
              {tablesInfo.length > 0 && (
                <div className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Database Tables:</h3>
                  <div className="space-y-3">
                    {tablesInfo.map((table, index) => (
                      <div key={index} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <span className="font-medium">{table.name}</span>
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded ${table.status === "Available" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                            {table.status}
                          </span>
                        </div>
                        {table.status === "Available" ? (
                          <span className="text-sm">Records: {table.count}</span>
                        ) : (
                          <span className="text-sm text-red-500">{table.error}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                This page tests the connection to your Supabase project and verifies database tables.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
