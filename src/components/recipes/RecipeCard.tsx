'use client';
import { IRecipe } from '@/types';
import { formatTime } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { FiClock, FiUsers } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function RecipeCard({ recipe }: { recipe: IRecipe }) {
  const router = useRouter();
  return (
    <Card hover onClick={() => router.push(`/dashboard/recipes/${recipe._id}`)}>
      <div className="h-44 relative overflow-hidden">
        {recipe.image ? (
          <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-accent/20 to-bg-elevated flex items-center justify-center">
            <span className="text-4xl font-bold text-accent/40">{recipe.title.charAt(0)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card/90 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-text text-sm line-clamp-1">{recipe.title}</h3>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-text-muted">
            <span className="flex items-center gap-1"><FiClock size={10} />{formatTime(recipe.cookingTime)}</span>
            <span className="flex items-center gap-1"><FiUsers size={10} />{recipe.servings}</span>
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
        </div>
      </div>
      <div className="px-3 py-2.5">
        <p className="text-[11px] text-text-muted line-clamp-2">{recipe.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {recipe.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant={tag === 'veg' ? 'green' : tag === 'non-veg' ? 'chili' : 'gray'} size="sm">{tag}</Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
