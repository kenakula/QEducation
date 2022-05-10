export class Routes {
  public static readonly LANDING = '/';
  public static readonly NOT_FOUND = '*';

  // protected
  public static readonly SIGN_IN = '/signin';
  public static readonly SIGN_UP = '/signup';
  public static readonly RESTORE_PASSWORD = '/restore-password';

  // private
  public static readonly MAIN = '/main';
  public static readonly CATEGORY_ARTICLES = '/main/:categoryId';
  public static readonly PROFILE = '/profile';
  public static readonly SINGLE_ARTICLE = '/articles/:articleId';
  public static readonly TESTS = '/tests';

  // admin
  public static readonly ADMIN = '/admin';
  public static readonly ADMIN_ARTICLES = '/admin/articles';
  public static readonly ADMIN_ARTICLES_EDITOR = '/admin/articles/editor';
  public static readonly ADMIN_STAFF = '/admin/staff';
  public static readonly ADMIN_STAFF_DETAILS = '/admin/staff/:staffId';
  public static readonly ADMIN_TESTS = '/admin/tests';
  public static readonly ADMIN_CATEGORIES = '/admin/categories';
  public static readonly ADMIN_MAILING = '/admin/mailing';
}
