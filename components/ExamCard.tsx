import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Clock, BarChart } from "lucide-react";

interface ExamCardProps {
  data: {
    id: number | string;
    name: string;
    description: string;
    difficulty: string;
    time: number | string;
    questions: number;
    sections: { name: string; time: number | null }[];
  };
  getDifficultyClass: (difficulty: string) => string;
  onDelete?: (id: number | string) => void;
  deletingId?: number | string | null;
}

export default function ExamCard({ data, getDifficultyClass, onDelete, deletingId }: ExamCardProps) {
  return (
    <div className="brutalist-card p-6">
      <h3 className="text-xl font-bold mb-2">{data.name}</h3>
      <p className="mb-4">{data.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`inline-block px-3 py-1 text-sm font-bold ${getDifficultyClass(data.difficulty)}`}>
          {data.difficulty}
        </span>
        <span className="bg-gray-200 px-3 py-1 text-sm font-bold flex items-center">
          <Clock className="h-4 w-4 mr-1" /> {data.time}
        </span>
        <span className="bg-gray-200 px-3 py-1 text-sm font-bold flex items-center">
          <BarChart className="h-4 w-4 mr-1" /> {data.questions} questions
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-bold mb-2">Sections:</h4>
        <div className="flex gap-2">
          {data.sections.map((section) => (
            <span key={section.name} className="inline-block border-2 border-black px-3 py-1 text-sm font-bold">
              {section.name}
            </span>
          ))}
        </div>
      </div>

      <Link href={`/dashboard/tests/${data.id}`}>
        <Button className="brutalist-button w-full">Start Test</Button>
      </Link>
      {onDelete && (
        <Button
          className="brutalist-button w-full mt-2 bg-red-500 hover:bg-red-600"
          variant="destructive"
          onClick={() => onDelete(data.id)}
          disabled={deletingId === data.id}
        >
          {deletingId === data.id ? 'Deleting...' : 'Delete'}
        </Button>
      )}
    </div>
  );
} 