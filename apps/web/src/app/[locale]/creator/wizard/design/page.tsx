import { DesignStudio } from "@/components/design-studio";

interface DesignPageProps {
    searchParams: Promise<{ designId?: string; fresh?: string }>;
}

export default async function CreatorDesignWizardPage({ searchParams }: DesignPageProps) {
    const { designId, fresh } = await searchParams;

    return (
        <DesignStudio
            initialMode="wizard"
            designId={designId}
            startFresh={fresh === "true"}
            productImage="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80"
        />
    );
}
