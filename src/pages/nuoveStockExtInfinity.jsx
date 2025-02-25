import { UbiExt } from "@/components/ubicazioni_ext";
import { TabUbiExt } from "@/components/tabUbi_Ext";

export default function AutoTable() {
  
  return (
      <div className="p-4 mx-auto max-w-screen-3xl md:p-6 max-w-screen-3xl">

        {/* UBICAZIONI ESTERNE */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
          <UbiExt />
        </div>

        {/* TABELLA ESTERNE */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 mt-4">
          <TabUbiExt />
        </div>

      </div>
  );
  
}