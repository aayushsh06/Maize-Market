import Link from 'next/link';
import { Plus } from 'lucide-react';
import AddProductModal from './AddProductModal';
import { useState } from 'react';

const Navbar = ({ onProductAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="bg-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Inventory Manager
        </Link>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProductAdded={onProductAdded}
      />
    </nav>
  );
};

export default Navbar; 