import { getCategories } from "@/data/loaders";
import CategoryButton from "@/components/custom/category-button";


export async function CategorySelect() {
  const data = await getCategories();
  const categories = data?.data;
  if (!categories) return null;

  return (
    <div className="w-full flex gap-2 justify-center items-center">
      {categories.map((category) => (
        <CategoryButton key={category.id} value={category.text}>
          {category.text}
        </CategoryButton>
      ))}
      <CategoryButton value="">all</CategoryButton>
    </div>
  );
}
