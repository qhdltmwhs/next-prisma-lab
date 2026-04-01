export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <div>product detail {id}</div>;
}
