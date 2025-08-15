/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Forger, useForge } from "@/lib/forge";
// import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { forwardRef } from "react";
import { CiEdit } from "react-icons/ci";
import { GoPlus } from "react-icons/go";
// import { z } from "zod";

type ItemsProps = {
  id: string;
  label: string;
};

const actions: Record<string, ItemsProps[]> = {
  dashboard: [
    {
      id: "read",
      label: "Read",
    },
  ],
  products: [
    {
      id: "read",
      label: "Read",
    },
    {
      id: "invite",
      label: "Invite",
    },
    {
      id: "delete",
      label: "Delete",
    },
  ],
  orders: [
    {
      id: "read",
      label: "Read",
    },
  ],
  profile: [
    {
      id: "read",
      label: "Read",
    },
    {
      id: "create",
      label: "Create",
    },
    {
      id: "update",
      label: "Update",
    },
    {
      id: "delete",
      label: "Delete",
    },
  ],
  activity_log: [
    {
      id: "read",
      label: "Read",
    },
    {
      id: "create",
      label: "Create",
    },
    {
      id: "update",
      label: "Update",
    },
    {
      id: "delete",
      label: "Delete",
    },
  ],
  roles: [
    {
      id: "read",
      label: "Read",
    },
    {
      id: "create",
      label: "Create",
    },
    {
      id: "update",
      label: "Update",
    },
    {
      id: "delete",
      label: "Delete",
    },
  ],
  businesses: [
    {
      id: "get",
      label: "Get",
    },
    {
      id: "add",
      label: "Add",
    },
    {
      id: "update",
      label: "Update",
    },
    {
      id: "delete",
      label: "Delete",
    },
  ],
  plans: [
    {
      id: "read",
      label: "Read",
    },
    {
      id: "create",
      label: "Create",
    },
    {
      id: "delete",
      label: "Delete",
    },
  ],
  business_profile: [
    {
      id: "read",
      label: "Read",
    },
    {
      id: "create",
      label: "Create",
    },
    {
      id: "update",
      label: "Update",
    },
    {
      id: "delete",
      label: "Delete",
    },
  ],
};

type RolePermission<T = unknown> = {
  title?: string;
  showBtn?: boolean;
  defaultValues: T;
  onSubmit: (data: any) => void;
  loading?: boolean;
};

// const schema = z
//   .object({
//     name: z.string(),
//     description: z.string(),
//     threshold: z.number().min(50),
//     type: z.string(),
//   })
//   .required();

export const RolePermission = forwardRef(
  (
    {
      title,
      showBtn,
      defaultValues,
      onSubmit,
      loading,
    }: RolePermission<any>,
    _ref
  ) => {
    const { ForgeForm, watch, setValue, getValues } = useForge({
      defaultValues,
    });

    const handleSubmit = () => {
      onSubmit(getValues());
    };
    console.log(getValues());

    return (
      <>
        <Dialog>
          <DialogTrigger asChild>
            {showBtn ? (
              <Button variant={"outline"} className="rounded-full">
                {title ? (
                  <CiEdit className="text-md" />
                ) : (
                  <GoPlus className="h-4 w-4 font-bold" />
                )}
                {title ? title : "Add Role"}
              </Button>
            ) : (
              <Button variant="outline" size="icon" className="border-primary">
                {title ? <CiEdit /> : <GoPlus />}
              </Button>
            )}
          </DialogTrigger>

          <DialogContent className="sm:max-w-[425px] max-h-[30rem] overflow-auto bg-white !py-5">
            <DialogHeader>
              <DialogTitle> {title ? title : "Add New Role"}</DialogTitle>
            </DialogHeader>

            <ForgeForm onSubmit={handleSubmit}>
              <Forger
                name="name"
                label="Role Name"
                component={TextInput}
                containerClass="mb-3"
              />

              <div className="pb-2">
                <p className="font-urbanist ">Permissions</p>
                <span className="text-sm font-light ">
                  Set permission needed for this role
                </span>
              </div>
              <>
                <RadioInput
                  getValue={watch}
                  getValues={getValues}
                  label="Dashboard"
                  name="dashboard"
                  onChange={setValue}
                />
                <RadioInput
                  getValue={watch}
                  getValues={getValues}
                  label="Profile"
                  name="profile"
                  onChange={setValue}
                />
                <RadioInput
                  getValue={watch}
                  getValues={getValues}
                  label="Activity"
                  name="activity_log"
                  onChange={setValue}
                />
                <RadioInput
                  name="roles"
                  label="Roles"
                  getValue={watch}
                  onChange={setValue}
                  getValues={getValues}
                />
                <RadioInput
                  name="businesses"
                  label="Businesses"
                  getValue={watch}
                  onChange={setValue}
                  getValues={getValues}
                />
              </>

              <Button isLoading={loading} type="submit" className="w-full">
                {title ? "Update" : "Add"}
              </Button>
            </ForgeForm>
          </DialogContent>
        </Dialog>
      </>
    );
  }
);

type RadioInputType = {
  onChange: (key: string, value: any) => void;
  name: string;
  label: string;
  getValue: (value: string) => any;
  getValues: (value: string) => any;
};

const RadioInput = ({
  onChange,
  label,
  name,
  getValue,
  getValues,
}: RadioInputType) => {
  return (
    <div className="py-3">
      <Forger
        name={name}
        label={label}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={(props: any) => (
          <div className="flex items-center gap-2 pb-2">
            <Label htmlFor={props.label}>{props.label}</Label>
            <Switch
              {...props}
              name={props.name}
              checked={props?.value}
              className="data-[state=checked]:bg-primary"
              onCheckedChange={(check: boolean) => {
                props.onChange(check);
                if (check === false) {
                  onChange(`${props.name}-actions`, []);
                  return;
                }
                onChange(`${props.name}-actions`, [`view_${props.name}`]);
              }}
            />
          </div>
        )}
      />

      {getValue(name) && (
        <div className="flex gap-2">
          {actions[name].map((item) => (
            <div className="flex items-center gap-1">
              <Checkbox
                id={item?.id}
                disabled={item.id === "read"}
                checked={getValue(`${name}-actions`).includes(
                  item.id === "read" ? `view_${name}` : `${item.id}_${name}`
                )}
                // defaultChecked={item.id === "read"}
                onCheckedChange={(checked) => {
                  if (checked === false) {
                    onChange(
                      `${name}-actions`,
                      getValues(`${name}-actions`).filter(
                        (pri: string) => pri !== `${item.id}_logs`
                      )
                    );
                    return;
                  }
                  onChange(`${name}-actions`, [
                    ...getValues(`${name}-actions`),
                    `${item.id}_${name}`,
                  ]);
                }}
                className={
                  "data-[state=checked]:bg-primary data-[state=checked]:text-white"
                }
              />

              <Label
                htmlFor={item.id}
                className="text-sm font-medium leading-none px-2"
              >
                {item?.label}
              </Label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
