"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Button } from "@/components/ui/button"
import { Search, TriangleAlert } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


const Categories = () => {
 
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchCategory, setSearchCategory] = useState('');
   
  useEffect(() => {
    fetchCategories();
  }, []);
  
  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');
    setCategories(response.data.categories);
  };

  const handleCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  const addCategory = async () => {
    if (!newCategory.trim()) {
      alert('Category name cannot be empty');
      return;
    }
    
    if (editingCategory) {
      const response = await axios.put(`/api/categories/${editingCategory._id}`, { name: newCategory, id: editingCategory._id });
      setCategories(categories.map(cat => cat._id === editingCategory._id ? response.data.category : cat));
       setEditingCategory(null);
      
    } else {
      const response = await axios.post('/api/categories', { name: newCategory });
      setCategories([...categories, response.data.category]);
    }
    setNewCategory('');
  };

  const editCategory = (category) => {
    setNewCategory(category.name);
    setEditingCategory(category);
  };

  const deleteCategory = async (id) => {
    await axios.delete(`/api/categories/${id}`, { params: { id: id } });
    setCategories(categories.filter(category => category._id !== id));
  };
  
  return (
    <div className='flex flex-col gap-6'>
      <div className='fixed border-b border-primary p-2 bg-white w-full z-30 flex items-center gap-40'>
        <div className='border border-primary p-2 rounded-lg w-fit'>
          <input
            type="text"
            value={newCategory}
            onChange={handleCategoryChange}
            placeholder="New Category"
            className='outline-none p-2 border-l border-t border-b'
          />
          <Button onClick={addCategory} disabled={!newCategory.trim()}>
            {editingCategory ? 'Update Category' : 'Add Category'}
          </Button>
        </div>
        <div className='flex items-center gap-2 border border-primary p-2 rounded-lg w-[30%]'>
          <Search className='text-primary font-bold'/>
          <input
            type='text'
            className='outline-none border-none w-full'
            placeholder='Search for Added Categories...'
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
        </div>
      </div>
      <div className='p-10 z-0 pt-[95px]'>
        <table className='border'>
          <thead>
            <tr className='border'>
              <th className='border'>Name</th>
              <th className='border'>Edit</th>
              <th className='border'>Delete</th>
            </tr>
          </thead>
          <tbody className='border'>
            {categories.filter((item) => {
              return searchCategory.toLowerCase() === "" ? item : item.name.toLowerCase().includes(searchCategory);
            }).map(category => (
              <tr key={category._id} className='border'>
                <td className='border px-3 py-2'>{category.name}</td>
                <td className='border px-3 py-2'>
                  <Button onClick={() => editCategory(category)} className='bg-green-700 hover:bg-green-800 text-white'>Edit</Button>
                </td>
                <td className='border px-3 py-2'>
                <AlertDialog>
  <AlertDialogTrigger>
  <Button variant='destructive'>Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent >
    <AlertDialogHeader>
      <AlertDialogTitle className='flex items-center gap-2 justify-center'><TriangleAlert color='red' size={32}/>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription >
       This action cannot be undone. This will permanently delete the category and also the Workers created under it.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter className='flex items-center justify-center'>
      <AlertDialogCancel className='py-3'>Cancel</AlertDialogCancel>
      <AlertDialogAction className='bg-red-500 hover:bg-red-500'>
      <Button onClick={() => deleteCategory(category._id)} variant='destructive'>Delete</Button>
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

                 
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Categories;
