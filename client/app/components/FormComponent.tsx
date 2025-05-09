type FormComponentProps = {
  title: string;
  buttonText: string;
  linkText: string;
  linkHref: string;
  linkPrompt: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  error: string | null;
  isLoading: boolean;
};

const FormComponent: React.FC<FormComponentProps> = ({
  title,
  buttonText,
  linkText,
  linkHref,
  linkPrompt,
  handleSubmit,
  error,
  isLoading,
}) => (
  <div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
    <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
      <h2 className='mt-10 text-center text-2xl/9 font-bold tracking-tight text-white'>
        {title}
      </h2>
    </div>

    <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor='username'
            className='block text-sm/6 font-medium text-gray-300'
          >
            Username
          </label>
          <div className='mt-2'>
            <input
              id='username'
              name='username'
              type='text'
              required
              autoComplete='username'
              className='block w-full rounded-md bg-gray-800 px-3 py-1.5 text-base text-gray-300 outline-1 -outline-offset-1 outline-gray-600 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-teal-500 sm:text-sm/6'
            />
          </div>
        </div>

        {error !== '' && (
          <div className='flexjustify-center'>
            <p className='text-sm text-red-500'>{error}</p>
          </div>
        )}

        {isLoading ? (
          <button
            disabled
            type='button'
            className='w-full justify-center py-1.5 px-3 me-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center'
          >
            <svg
              aria-hidden='true'
              role='status'
              className='inline w-4 h-4 me-3 text-gray-200 animate-spin dark:text-gray-600'
              viewBox='0 0 100 101'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
                fill='currentColor'
              />
              <path
                d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
                fill='#1C64F2'
              />
            </svg>
            Loading...
          </button>
        ) : (
          <div>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500'
            >
              {buttonText}
            </button>
          </div>
        )}
      </form>
      <div className='mt-6 text-center'>
        <p className='text-sm text-gray-300'>
          {linkPrompt}{' '}
          <a
            href={linkHref}
            className='font-semibold text-teal-500 hover:text-teal-400'
          >
            {linkText}
          </a>
        </p>
      </div>
    </div>
  </div>
);
export default FormComponent;
