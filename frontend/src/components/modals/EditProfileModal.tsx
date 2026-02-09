
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string; district: string }) => void;
    initialData: { name: string; district: string };
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
}) => {
    const [name, setName] = useState(initialData.name);
    const [district, setDistrict] = useState(initialData.district);

    useEffect(() => {
        if (isOpen) {
            setName(initialData.name);
            setDistrict(initialData.district);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name, district });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            District
                        </label>
                        <input
                            type="text"
                            value={district}
                            onChange={(e) => setDistrict(e.target.value)}
                            className="w-full rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            placeholder="Enter your district"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfileModal;
