import { UbiExt } from "@/components/ubicazioni_ext";
import { TabUbiExt } from "@/components/tabUbi_Ext";

export default function AutoTable() {
  

  return (
    <div className="p-5">
        {/* UBICAZIONI ESTERNE */}
        <UbiExt />
        {/* TABELLA ESTERNE */}
        <TabUbiExt />
    </div>
  );
}