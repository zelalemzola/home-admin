"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UploadButton } from '@uploadthing/react';
import Image from 'next/image';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select } from '@/components/ui/select';
import Link from 'next/link';
const Workers = () => {
  const [maids, setMaids] = useState([]);
  const [categories, setCategories] = useState([]);
  const [createFormState, setCreateFormState] = useState({
    name: '',
    fathersName: '',
    grandFathersName: '',
    imageUrl: '',
    imageKey: '',
    price: 0,
    experience: [''],
    review: [''],
    category: '',
    documentUrl: '',
    documentKey: '',
    documentName: ''
  });
  const [updateFormState, setUpdateFormState] = useState({
    id: '',
    name: '',
    fathersName: '',
    grandFathersName: '',
    imageUrl: '',
    imageKey: '',
    price: 0,
    experience: [''],
    review: [''],
    category: '',
    documentUrl: '',
    documentKey: '',
    documentName: ''
  });
  const [errors, setErrors] = useState([]);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const router = useRouter();

  useEffect(() => {
    fetchMaids();
    fetchCategories();
  }, []);

  const fetchMaids = async () => {
    const response = await axios.get('/api/maids');
    setMaids(response.data.maids);
  };

  const fetchCategories = async () => {
    const response = await axios.get('/api/categories');
    setCategories(response.data.categories);
  };

  const validateForm = (formState) => {
    const newErrors = [];
    if (!formState.name) newErrors.push('Name is required');
    if (!formState.fathersName) newErrors.push('Father\'s Name is required');
    if (!formState.grandFathersName) newErrors.push('Grandfather\'s Name is required');
    if (!formState.imageUrl) newErrors.push('Image URL is required');
    if (!formState.imageKey) newErrors.push('Image Key is required');
    if (!formState.price) newErrors.push('Price is required');
    if (formState.experience.some(exp => !exp)) newErrors.push('All experience fields must be filled');
    if (formState.review.some(rev => !rev)) newErrors.push('All review fields must be filled');
    if (!formState.category) newErrors.push('Category is required');
    return newErrors;
  };

  const handleSubmit = async (event, isUpdate = false) => {
    event.preventDefault();
    const formState = isUpdate ? updateFormState : createFormState;
    const validationErrors = validateForm(formState);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    const { id, name, fathersName, grandFathersName, imageUrl, imageKey, price, experience, review, category, documentUrl, documentKey, documentName } = formState;

    if (isUpdate) {
      await axios.put(`/api/maids/${id}`, { name, fathersName, grandFathersName, imageUrl, imageKey, price, experience, review, category, documentUrl, documentKey, documentName });
    } else {
      await axios.post('/api/maids', { name, fathersName, grandFathersName, imageUrl, imageKey, price, experience, review, category, documentUrl, documentKey, documentName });
    }

    setCreateFormState({
      name: '',
      fathersName: '',
      grandFathersName: '',
      imageUrl: '',
      imageKey: '',
      price: 0,
      experience: [''],
      review: [''],
      category: '',
      documentUrl: '',
      documentKey: '',
      documentName: ''
    });

    setUpdateFormState({
      id: '',
      name: '',
      fathersName: '',
      grandFathersName: '',
      imageUrl: '',
      imageKey: '',
      price: 0,
      experience: [''],
      review: [''],
      category: '',
      documentUrl: '',
      documentKey: '',
      documentName: ''
    });

    setErrors([]);
    fetchMaids();
    if (isUpdate) setShowUpdateForm(false);
  };

  const handleEdit = (maid) => {
    setUpdateFormState({
      id: maid._id,
      name: maid.name,
      fathersName: maid.fathersName,
      grandFathersName: maid.grandFathersName,
      imageUrl: maid.imageUrl,
      imageKey: maid.imageKey,
      price: maid.price,
      experience: maid.experience,
      review: maid.review,
      category: maid.category._id,
      documentUrl: maid.documentUrl,
      documentKey: maid.documentKey,
      documentName: maid.documentName
    });
    setShowUpdateForm(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/maids/${id}`);
    fetchMaids();
  };

  const handleChange = (e, isUpdate = false) => {
    const { name, value } = e.target;
    const formState = isUpdate ? updateFormState : createFormState;
    const setFormState = isUpdate ? setUpdateFormState : setCreateFormState;

    if (name.startsWith('experience') || name.startsWith('review')) {
      const index = parseInt(name.split('-')[1]);
      const updatedArray = [...formState[name.split('-')[0]]];
      updatedArray[index] = value;
      setFormState({ ...formState, [name.split('-')[0]]: updatedArray });
    } else {
      setFormState({ ...formState, [name]: value });
    }
  };

  const handleAddField = (field, isUpdate = false) => {
    const formState = isUpdate ? updateFormState : createFormState;
    const setFormState = isUpdate ? setUpdateFormState : setCreateFormState;
    setFormState({ ...formState, [field]: [...formState[field], ''] });
  };

  const handleRemoveField = (field, index, isUpdate = false) => {
    const formState = isUpdate ? updateFormState : createFormState;
    const setFormState = isUpdate ? setUpdateFormState : setCreateFormState;
    const updatedArray = [...formState[field]];
    updatedArray.splice(index, 1);
    setFormState({ ...formState, [field]: updatedArray });
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredMaids = maids.filter((maid) => maid.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className=''>
        <div className="fixed z-30 w-full px-4 py-3 border-b shadow-md flex items-center gap-20">
        <Drawer>
  <DrawerTrigger>
  <div className='flex items-center justify-between gap-10 rounded-sm p-2 bg-primary'>
              <PlusCircle color='white' size={22} />
              <h1 className=' text-white'>Add a Worker</h1>
            </div>
  </DrawerTrigger>
  <DrawerContent className='h-[95%] '>
    <DrawerHeader className='flex items-center justify-center flex-col'>
      <DrawerTitle>Please be sure to enter all values before submitting</DrawerTitle>
      <DrawerDescription>carefully enter values</DrawerDescription>
    </DrawerHeader>
    <form onSubmit={(e) => handleSubmit(e)} className='w-full '>
      <div className="flex flex-col items-start gap-3">
      <ScrollArea className='h-full px-2 w-full bg-white px-4 '>
      <div className="flex flex-col gap-3 h-[360px] text-black pt-2 py-2 px-2 w-full">
         <div className="flex flex-wrap gap-4 ">
        <Input className='w-[32%]' name="name" value={createFormState.name} onChange={(e) => handleChange(e)} placeholder="Name" required />
        <Input className='w-[32%]' name="fathersName" value={createFormState.fathersName} onChange={(e) => handleChange(e)} placeholder="Father's Name" required />
        <Input className='w-[32%]' name="grandFathersName" value={createFormState.grandFathersName} onChange={(e) => handleChange(e)} placeholder="Grandfather's Name" required />
       </div>
        <div className='flex flex-col gap-5'>
          <div className='flex items-center justify-start gap-2'>
            <h1 className='text-primary font-bold'>Upload Worker&apos;s Image</h1>
            <UploadButton
              className='pt-5 flex'
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                console.log("Files: ", res);
                alert("Upload Completed");
                setCreateFormState({
                  ...createFormState,
                  imageUrl: res[0]?.url,
                  imageKey: res[0]?.key,
                });
              }}
              onUploadError={(error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
          {createFormState.imageUrl && <Image src={createFormState.imageUrl} className='p-3' width={120} height={150} alt="" />}
        </div>
        <div className="flex items-center gap-2">
          <h2 className='text-lg font-bold text-primary'>Wage per Month</h2>       
           <Input name="price" type="number" value={createFormState.price} onChange={(e) => handleChange(e)} placeholder="Wage per Month" required  className='w-1/4'/>
       </div>
       <div className="flex flex-col gap-3">
        <h2 className='text-lg font-bold text-primary'>Enter workers previous experience</h2>
      
        {createFormState.experience.map((exp, index) => (
          <div key={index} className='flex items-center gap-3'>
            <Input name={`experience-${index}`} value={exp} onChange={(e) => handleChange(e)} placeholder="3+ Years at a french Restaurant" className='w-1/3'/>
            <Button type="button" onClick={() => handleRemoveField('experience', index)}>Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={() => handleAddField('experience')}>Add Experience</Button>
        </div>
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold text-primary">Give the Worker a starter Company Review</h2>
       
        {createFormState.review.map((rev, index) => (
          <div key={index} className='flex items-center gap-3'>
            <Input name={`review-${index}`} value={rev} onChange={(e) => handleChange(e)} placeholder="Review" className='w-1/3'/>
            <Button type="button" onClick={() => handleRemoveField('review', index)}>Remove</Button>
          </div>
        ))}
        <Button type="button" onClick={() => handleAddField('review')}>Add Review</Button>
        </div>
        <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-primary">Select the Category of the Worker</h2>
        <select name="category" value={createFormState.category} onChange={(e) => handleChange(e)} required className=' p-2 rounded-full border border-black'>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
        </div>
        <div className="flex flex-col gap-2">
       
          <h2 className="text-lg font-bold text-primary">Attach Worker&apos;s Document</h2>
       
        {createFormState.documentName ? (
          <Link target="_blank" href={createFormState.documentUrl} className="col-span-6 sm:col-span-4 text-red-400 underline">
            {createFormState.documentName}
          </Link>
        ) : (
          <UploadButton
            className="flex-start  w-fit"
            endpoint={"productPdf"}
            onClientUploadComplete={(url) => {
              console.log("files", url);
              setCreateFormState({
                ...createFormState,
                documentName: url[0]?.name,
                documentUrl: url[0]?.url,
                documentKey: url[0]?.key
              });
              window.alert("Upload completed");
            }}
          />
        )}
        </div>
      
        </div>
        </ScrollArea> 
         <Button type="submit" className='w-1/3 bg-green-500 hover:bg-green-600'>Add Maid</Button>
        </div>
      </form>
    <DrawerFooter>
     
      <DrawerClose>
        <Button variant="destructive" >Close</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>
   <div className="flex items-center gap-2 p-2 border border-primary rounded-full w-[40%]">
    <Search/>
    <input
        type="text"
        placeholder="Search Workers..."
        value={searchQuery}
        onChange={handleSearch}
        className=" border-none outline-none w-full"
      />
   </div>
        </div>

        <div className="z-0 w-full pt-[100px] px-10 py-2">
        <table className="min-w-full bg-white w-full border">
        <thead className="bg-gray-800 text-white">
        <tr className='border'>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Name</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Father&apos;s Name</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Grandfather&apos;s Name</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Image</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Price</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Category</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className='text-gray-700'>
            {filteredMaids.map((maid) => (
              <tr key={maid._id} className='border-b '>
                <td className=" py-3 px-4">{maid.name}</td>
                <td className=" py-3 px-4">{maid.fathersName}</td>
                <td className=" py-3 px-4">{maid.grandFathersName}</td>
                <td className=" py-3 px-4"><img src={maid.imageUrl} alt={maid.name} width={50} height={50} /></td>
                <td className=" py-3 px-4">{maid.price}</td>
                <td className=" py-3 px-4">{maid.category.name}</td>
                <td className=" py-3 px-4 flex items-center gap-2" >
                <Drawer>
                 <DrawerTrigger>
                 <Button onClick={() => handleEdit(maid)} className='bg-green-500 hover:bg-green-500 text-white p-2 px-4'>Edit</Button>
                 </DrawerTrigger>
                 <DrawerContent className='h-[95%] w-full'>
                   <DrawerHeader className='mx-auto'>
                     <DrawerTitle className='text-red-700'>Please update values carefully</DrawerTitle>
                   </DrawerHeader>
                   <form onSubmit={(e) => handleSubmit(e, true)} className='w-full'>
                   <div className="flex flex-col items-start gap-3">
      <ScrollArea className='h-full px-2 w-full bg-white px-4 '>
      <div className="flex flex-col gap-3 h-[360px] text-black pt-2 py-2 px-2 w-full">
      <div className="flex flex-wrap gap-3">
        <h2 className='text-primary font-bold w-[32%]'>Name</h2>
        <h2 className='text-primary font-bold w-[32%]'>Father&apos;s Name</h2>
        <h2 className='text-primary font-bold w-[32%]'>Grand Father&apos;s Name</h2>
      </div>
          <div className="flex flex-wrap gap-3">
          <Input className='w-[32%]' name="name" value={updateFormState.name} onChange={(e) => handleChange(e, true)} placeholder="Name" required />
          <Input className='w-[32%]' name="fathersName" value={updateFormState.fathersName} onChange={(e) => handleChange(e, true)} placeholder="Father's Name" required />
          <Input className='w-[32%]' name="grandFathersName" value={updateFormState.grandFathersName} onChange={(e) => handleChange(e, true)} placeholder="Grandfather's Name" required />
         </div> 
         <div className='flex flex-col gap-5'>
            <div className='flex items-center justify-start gap-2'>
              <h1 className='text-primary font-bold'>Upload to replace Image</h1>
              <UploadButton
                className='pt-5 flex '
                endpoint="imageUploader"
                onClientUploadComplete={(res) => {
                  console.log("Files: ", res);
                  alert("Upload Completed");
                  setUpdateFormState({
                    ...updateFormState,
                    imageUrl: res[0]?.url,
                    imageKey: res[0]?.key,
                  });
                }}
                onUploadError={(error) => {
                  alert(`ERROR! ${error.message}`);
                }}
              />
            </div>
            {updateFormState.imageUrl && <Image src={updateFormState.imageUrl} className='p-3' width={120} height={150} alt="" />}
          </div>
          <div className="flex items-center gap-3">
            <h2 className='text-lg text-primary font-bold'>Update Price </h2>
           <Input name="price" type="number" value={updateFormState.price} onChange={(e) => handleChange(e, true)} placeholder="Price" required className='w-[30%]'/>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className="text-primary text-lg font-bold">Update Experiences</h2>
          
          {updateFormState.experience.map((exp, index) => (
            <div key={index} className='flex items-center gap-3'>
              <Input name={`experience-${index}`} value={exp} onChange={(e) => handleChange(e, true)} placeholder="Experience" className='w-[20%]'/>
              <Button type="button" onClick={() => handleRemoveField('experience', index, true)}>Remove</Button>
            </div>
          ))}
          <Button type="button" onClick={() => handleAddField('experience', true)}>Add Experience</Button>
          </div>
          <div className="flex flex-col gap-3">
            <h2 className='text-primary font-bold text-lg'>Update Reviews</h2>
          
          {updateFormState.review.map((rev, index) => (
            <div key={index} className='flex items-center gap-3'>
              <Input name={`review-${index}`} value={rev} onChange={(e) => handleChange(e, true)} placeholder="Review" className='w-[30%]' />
              <Button type="button" onClick={() => handleRemoveField('review', index, true)}>Remove</Button>
            </div>
          ))}
          <Button type="button" onClick={() => handleAddField('review', true)}>Add Review</Button>
          </div>
          <div className="flex items-center gap-3">
            <h2 className='text-primary font-bold text-lg'>Update Category</h2>
          
          <select name="category" value={updateFormState.category} onChange={(e) => handleChange(e, true)} required className='w-fit border border-black p-1 rounded-full'>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          
          </select>
          </div>
            <div className="flex flex-col gap-3">
              <h2 className='text-lg text-primary font-bold'>Attach Another Document to replace</h2>
            
            <div className="flex items-center gap-4">
            <Link target="_blank" href={updateFormState.documentUrl} className="col-span-6 sm:col-span-4 text-red-400 underline">
              {updateFormState.documentName}
            </Link>
            <UploadButton
              className=""
              endpoint={"productPdf"}
              onClientUploadComplete={(url) => {
                console.log("files", url);
                setUpdateFormState({
                  ...updateFormState,
                  documentName: url[0]?.name,
                  documentUrl: url[0]?.url,
                  documentKey: url[0]?.key
                });
                window.alert("Upload completed");
              }}
            />
           </div>
           </div>
         
          </div>
          </ScrollArea>
           <Button type="submit" className='bg-cyan-800 w-[20%]' >Update Maid</Button>
          </div>
        </form>
                   <DrawerFooter>
                     <DrawerClose>
                       <Button variant="destructive" className='w-[20%]'>Cancel</Button>
                     </DrawerClose>
                   </DrawerFooter>
                 </DrawerContent>
               </Drawer>
                  <Button onClick={() => handleDelete(maid._id)} variant='destructive' className='p-2'>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
      </table>
        </div>
    </div>
  )
}

export default Workers;