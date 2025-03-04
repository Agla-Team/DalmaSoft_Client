import { UbiDalmaUsato } from "@/components/ubicazioni_Use_Dalma";
import { TabUbiUseDalma } from "@/components/tabInv_Usate";

export default function AutoTable() {
  
  return (
      
    <>
      <div className="overflow-x-hidden">

        {/* UBICAZIONI ESTERNE */}
        <div className="w-full max-w-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <UbiDalmaUsato />
        </div>

        {/* TABELLA ESTERNE */}
        <div className="w-full max-w-full rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 mt-4">
          <TabUbiUseDalma />
        </div>

      </div>
    </>
     
  ); 
}