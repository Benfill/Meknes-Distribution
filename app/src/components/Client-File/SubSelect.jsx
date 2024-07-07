import { useState, useEffect } from 'react';
import GET from '../../utils/GET';

export function useSubSelect() {
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                let response = await GET('categories');
                if (response.message === 'success') {
                    const allSubCategories = response.categories.flatMap(category => 
                        category.sub_categories
                    );
                    setSubCategories(allSubCategories);
                } else {
                    console.error('Failed to fetch categories:', response.message);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return { subCategoryOptions: subCategories.map((subCategory) => ({
        key: subCategory.id,
        value: subCategory.id,
        label: subCategory.name
    })), loading };
}
