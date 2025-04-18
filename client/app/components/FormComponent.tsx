type FormComponentProps = {
  title: string;
  buttonText: string;
  linkText: string;
  linkHref: string;
  linkPrompt: string;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

const FormComponent: React.FC<FormComponentProps> = ({
  title,
  buttonText,
  linkText,
  linkHref,
  linkPrompt,
  handleSubmit,
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

        <div>
          <button
            type='submit'
            className='flex w-full justify-center rounded-md bg-teal-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-teal-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-500'
          >
            {buttonText}
          </button>
        </div>
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
