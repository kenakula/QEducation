/* eslint-disable react-hooks/exhaustive-deps */
import { Loader } from 'app/components/loader';
import { Main } from 'app/components/main';
import { PageTitle } from 'app/components/typography';
import { TechnicalIssues } from 'app/components/technical-issues';
import { BootState } from 'app/constants/boot-state';
import { Category } from 'app/constants/category-model';
import { useAdminStore } from 'app/stores/admin-store/admin-store';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import CategoriesList from './sub-components/categories-list';
import CategoryEdit from './sub-components/category-edit';

const AdminCategoriesPage = observer((): JSX.Element => {
  const store = useAdminStore();

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  useEffect(() => {
    if (!store.isInited) {
      store.init();
    }
  }, []);

  const handleCategoryClick = (item: Category): void => {
    setSelectedCategory(item);
  };

  const resetSelectedCategory = (): void => {
    setSelectedCategory(null);
  };

  switch (store.bootState) {
    case BootState.Success:
      return (
        <Main>
          <PageTitle>Выберите категорию</PageTitle>
          {selectedCategory ? (
            <CategoryEdit
              category={selectedCategory}
              resetCategory={resetSelectedCategory}
            />
          ) : (
            <CategoriesList
              onClick={handleCategoryClick}
              list={store.categories}
            />
          )}
        </Main>
      );
    case BootState.Error:
      return <TechnicalIssues message="При загрузке произошла ошибка" />;
    default:
      return <Loader />;
  }
});

export default AdminCategoriesPage;
