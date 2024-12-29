// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

import { ObjectState } from 'app/pages/Object/slice/types';
import { PageState } from 'app/pages/Pages/slice/types';
import { GlobalState } from 'app/slice/types';
import { SettingState } from 'app/pages/Setting/slice/types';
import { TranslationState } from 'app/pages/Translation/slice/types';
import { UserState } from 'app/pages/User/slice/types';
import { RoleState } from 'app/pages/Role/slice/types';
import { IndexingState } from 'app/pages/Indexing/slice/types';
import { CustomerState } from 'app/pages/Customers/slice/types';
import { PageDetailState } from 'app/pages/PageDetail/slice/types';
import { PermissionState } from 'app/components/Permission/slice/types';
import { MediaLibraryDetailState } from 'app/pages/MediaLibraryDetail/slice/types';
import { SeoHttpState } from 'app/pages/404-301/slice/types';

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
export interface RootState {
  global: GlobalState;
  pages: PageState;
  objects: ObjectState;
  setting: SettingState;
  translation: TranslationState;
  users: UserState;
  roles: RoleState;
  indexings: IndexingState;
  customers: CustomerState;
  pageDetails: PageDetailState;
  permissions: PermissionState;
  mediaLibraryDetails: MediaLibraryDetailState;
  seoHttps: SeoHttpState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
