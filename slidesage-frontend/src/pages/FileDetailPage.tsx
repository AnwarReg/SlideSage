import { useParams } from 'react-router-dom';

export default function FileDetailPage() {
  const { id } = useParams();
  
  return (
    <div className="py-8">
      <h1 className="text-2xl font-bold mb-4">File Detail: {id}</h1>
      <p className="text-gray-600">File detail placeholder</p>
    </div>
  );
}