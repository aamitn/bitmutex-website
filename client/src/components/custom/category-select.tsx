import { getCategories } from "@/data/loaders";
import CategoryButton from "@/components/custom/category-button";

export async function CategorySelect() {
  const data = await getCategories();
  const categories = data?.data;

  if (!categories) return null;

  // Filter categories that have "Blog Post Category" in their description
  const filteredCategories = categories.filter(
    (category) =>
      category.description?.includes("Blog Post Category") // Ensure exact description match
  );

  if (filteredCategories.length === 0) return null;

  return (
    <div className="w-full flex flex-wrap gap-2 justify-center items-center">
      {filteredCategories.map((category) => (
        <CategoryButton key={category.id} value={category.text}>
          {category.text.charAt(0).toUpperCase() + category.text.slice(1).toLowerCase()}
        </CategoryButton>
      ))}
      <CategoryButton value="">All</CategoryButton>
    </div>
  );
}
