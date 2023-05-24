import type {
  ActionArgs,
  TypedResponse,
  V2_MetaFunction,
} from "@remix-run/cloudflare"
import { withZod } from "@remix-validated-form/with-zod"
import type { ValidationErrorResponseData } from "remix-validated-form"
import {
  useField,
  useIsSubmitting,
  ValidatedForm,
  validationError,
} from "remix-validated-form"
import { z } from "zod"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ]
}

const submitV = withZod(
  z.object({
    url: z.string().url(),
  }),
)

export const action = async ({
  request,
}: ActionArgs): Promise<TypedResponse<ValidationErrorResponseData>> => {
  switch (request.method) {
    case "POST":
      const v = await submitV.validate(await request.formData())
      if (v.error) return validationError(v.error)
      return validationError({ fieldErrors: { url: "Success" } })

    default:
      throw new Error(`${request.method} not supported`)
  }
}

const Field = ({
  buttonText,
  label,
  placeholder,
}: {
  buttonText: string
  placeholder?: string
  label: string
}) => {
  const name = "url"

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { error, getInputProps, defaultValue } = useField(name)
  const disabled = useIsSubmitting()

  return (
    <label className="flex w-full flex-col space-y-1">
      <span className="font-semibold text-white">{label}</span>

      <div className="flex">
        <input
          type="url"
          className="hover:shadow-outline form-input min-w-0 flex-grow rounded-none rounded-l-md duration-300 disabled:opacity-50"
          placeholder={placeholder}
          disabled={disabled}
          required
          name={name}
          defaultValue={defaultValue ? String(defaultValue) : undefined}
          {...getInputProps()}
        />

        <button
          type="submit"
          className="h-12 w-20 rounded-r-md bg-accent py-2 font-medium text-white duration-200 hover:bg-indigo-900 disabled:opacity-75"
          disabled={disabled}
        >
          {disabled ? "Loading..." : buttonText}
        </button>
      </div>

      {error ? (
        <p className="text-sm font-medium text-gray-400">{error}</p>
      ) : null}
    </label>
  )
}

export default function Index() {
  return (
    <main style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <ValidatedForm validator={submitV} method={"post"}>
        <Field buttonText={"Btn"} label={"Lbl"} placeholder={"Placeholder"} />
      </ValidatedForm>
    </main>
  )
}
