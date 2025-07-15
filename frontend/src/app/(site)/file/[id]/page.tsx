type FilePageProps = {
    params: { id: string };
  };
  
  export default function FilePage({ params }: FilePageProps) {
    return (
      <div className="p-8">
        <h1 className="text-xl font-semibold">File Detail</h1>
        <p>File ID: {params.id}</p>
      </div>
    );
  }
  