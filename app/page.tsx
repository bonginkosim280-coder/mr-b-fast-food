import { createClient } from '@supabase/supabase-js'
import AddToCartButton from "@/components/AddToCartButton";

export const instant = false;

export default async function Home() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  )

  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('*')

  if (error) {
    return <div className="p-8 text-red-500">Error loading menu: {error.message}</div>
  }

  return (
    <main className="p-4 md:p-8 bg-gray-50 min-h-screen">
      
      {/* VIDEO ADVERTISEMENT */}
      <div className="max-w-5xl mx-auto mb-10 rounded-xl overflow-hidden shadow-lg">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-64 md:h-96 object-cover"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-burger-with-fries-and-a-drink-on-a-table-42987-large.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-center text-orange-600">MR B Fast-food Menu</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {menuItems?.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col">
            
            {/* Display the image if it exists */}
            {item.image_url && (
              <img 
                src={item.image_url} 
                alt={item.name} 
                className="w-full h-48 object-cover" 
              />
            )}

            {/* Card Content with padding */}
            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-4 flex-grow">{item.description}</p>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-green-600">R{item.price}</span>
                <AddToCartButton
                  product={{
                    id: item.id,
                    name: item.name,
                    price: Number(item.price),
                  }}
                  disabled={!item.is_available} 
                />
              </div>
            </div>

          </div>
        ))}
      </div>
    </main>
  )
}