"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UploadButton } from '@uploadthing/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const MaidsPage = () => {
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
    <div>
      <h1>Maids</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <h2>Add Maid</h2>
        <input name="name" value={createFormState.name} onChange={(e) => handleChange(e)} placeholder="Name" required />
        <input name="fathersName" value={createFormState.fathersName} onChange={(e) => handleChange(e)} placeholder="Father's Name" required />
        <input name="grandFathersName" value={createFormState.grandFathersName} onChange={(e) => handleChange(e)} placeholder="Grandfather's Name" required />
        <div className='flex flex-col gap-5'>
          <div className='flex items-center justify-start gap-2'>
            <h1 className='text-primary font-bold'>Upload Image</h1>
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
        <input name="imageUrl" value={createFormState.imageUrl} onChange={(e) => handleChange(e)} placeholder="Image URL" required />
        <input name="imageKey" value={createFormState.imageKey} onChange={(e) => handleChange(e)} placeholder="Image Key" required />
        <input name="price" type="number" value={createFormState.price} onChange={(e) => handleChange(e)} placeholder="Price" required />

        {createFormState.experience.map((exp, index) => (
          <div key={index}>
            <input name={`experience-${index}`} value={exp} onChange={(e) => handleChange(e)} placeholder="Experience" />
            <button type="button" onClick={() => handleRemoveField('experience', index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddField('experience')}>Add Experience</button>

        {createFormState.review.map((rev, index) => (
          <div key={index}>
            <input name={`review-${index}`} value={rev} onChange={(e) => handleChange(e)} placeholder="Review" />
            <button type="button" onClick={() => handleRemoveField('review', index)}>Remove</button>
          </div>
        ))}
        <button type="button" onClick={() => handleAddField('review')}>Add Review</button>

        <select name="category" value={createFormState.category} onChange={(e) => handleChange(e)} required>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>{category.name}</option>
          ))}
        </select>
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-gray-500 tracking-wide">Attach Document</label>
        </div>
        {createFormState.documentName ? (
          <a target="_blank" href={createFormState.documentUrl} className="col-span-6 sm:col-span-4 text-red-400 underline">
            {createFormState.documentName}
          </a>
        ) : (
          <UploadButton
            className=" "
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
        <button type="submit">Add Maid</button>
      </form>

      {showUpdateForm && (
        <form onSubmit={(e) => handleSubmit(e, true)}>
          <h2>Update Maid</h2>
          <input name="name" value={updateFormState.name} onChange={(e) => handleChange(e, true)} placeholder="Name" required />
          <input name="fathersName" value={updateFormState.fathersName} onChange={(e) => handleChange(e, true)} placeholder="Father's Name" required />
          <input name="grandFathersName" value={updateFormState.grandFathersName} onChange={(e) => handleChange(e, true)} placeholder="Grandfather's Name" required />
          <div className='flex flex-col gap-5'>
            <div className='flex items-center justify-start gap-2'>
              <h1 className='text-primary font-bold'>Upload Image</h1>
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
          <input name="imageUrl" value={updateFormState.imageUrl} onChange={(e) => handleChange(e, true)} placeholder="Image URL" required />
          <input name="imageKey" value={updateFormState.imageKey} onChange={(e) => handleChange(e, true)} placeholder="Image Key" required />
          <input name="price" type="number" value={updateFormState.price} onChange={(e) => handleChange(e, true)} placeholder="Price" required />

          {updateFormState.experience.map((exp, index) => (
            <div key={index}>
              <input name={`experience-${index}`} value={exp} onChange={(e) => handleChange(e, true)} placeholder="Experience" />
              <button type="button" onClick={() => handleRemoveField('experience', index, true)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddField('experience', true)}>Add Experience</button>

          {updateFormState.review.map((rev, index) => (
            <div key={index}>
              <input name={`review-${index}`} value={rev} onChange={(e) => handleChange(e, true)} placeholder="Review" />
              <button type="button" onClick={() => handleRemoveField('review', index, true)}>Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => handleAddField('review', true)}>Add Review</button>

          <select name="category" value={updateFormState.category} onChange={(e) => handleChange(e, true)} required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
          </select>
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-gray-500 tracking-wide">Attach Document</label>
          </div>
          {updateFormState.documentName ? (
            <a target="_blank" href={updateFormState.documentUrl} className="col-span-6 sm:col-span-4 text-red-400 underline">
              {updateFormState.documentName}
            </a>
          ) : (
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
          )}
          <button type="submit">Update Maid</button>
        </form>
      )}

      <input type="text" value={searchQuery} onChange={handleSearch} placeholder="Search by Name" />
      <div>
        <table>
          <thead  className="bg-gray-800 text-white">
            <tr>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Name</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Father&apos;s Name</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Grandfather&apos;s Name</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Image</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Price</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Category</th>
              <th className=" py-3 px-4 uppercase font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMaids.map((maid) => (
              <tr key={maid._id}>
                <td className=" py-3 px-4">{maid.name}</td>
                <td className=" py-3 px-4">{maid.fathersName}</td>
                <td className=" py-3 px-4">{maid.grandFathersName}</td>
                <td className=" py-3 px-4"><img src={maid.imageUrl} alt={maid.name} width={50} height={50} /></td>
                <td className=" py-3 px-4">{maid.price}</td>
                <td className=" py-3 px-4">{maid.category.name}</td>
                <td className=" py-3 px-4">
                  <Button onClick={() => handleEdit(maid)} className='bg-green-500 hover:bg-green-500 text-white p-2 px-4'>Edit</Button>
                  <Button onClick={() => handleDelete(maid._id)} variant='destructive p-2'>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {errors.length > 0 && (
        <div>
          {errors.map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaidsPage;
