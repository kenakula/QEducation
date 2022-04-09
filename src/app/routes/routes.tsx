export class Routes {
  public static readonly LANDING = '/';
  public static readonly NOT_FOUND = '*';

  // protected
  public static readonly SIGN_IN = '/signin';
  public static readonly SIGN_UP = '/signup';
  public static readonly RESTORE_PASSWORD = '/restore-password';

  // private
  public static readonly MAIN = '/main';
  public static readonly PROFILE = '/profile';
  public static readonly CATEGORY_ARTICLES = '/articles/:category';
  public static readonly ARTICLE_PAGE = '/articles/:category/:articleId';
  public static readonly TESTS = '/tests';

  // admin
  public static readonly ADMIN = '/admin';
  public static readonly ADMIN_ARTICLES = '/admin/articles';
  public static readonly ADMIN_ARTICLES_EDITOR = '/admin/articles/editor';
  public static readonly ADMIN_STAFF = '/admin/staff';
  public static readonly ADMIN_STAFF_DETAILS = '/admin/staff/:staffId';
  public static readonly ADMIN_TESTS = '/admin/tests';
  public static readonly ADMIN_LISTS = '/admin/lists';
}
