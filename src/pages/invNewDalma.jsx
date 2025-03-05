import UbiDalmaNuovo from "@/components/ubicazioni_New_Dalma";
import TabUbiNewDalma from "@/components/tabInv_Nuove";

export default function invNewDalma() {
  
  return (
      
    <>
      <div className="overflow-x-hidden">

        {/* UBICAZIONI ESTERNE */}
        <div className="w-full max-w-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <UbiDalmaNuovo />
        </div>

        {/* TABELLA ESTERNE */}
        <div className="w-full max-w-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 mt-4">
          <TabUbiNewDalma />
        </div>

      </div>
    </>
     
  ); 
}