/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextInput } from "@/components/layouts/FormInputs/TextInput";
import { Forger, useForge} from "@/lib/forge";
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
  members: [
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
  logs: [
    {
      id: "read",
      label: "Read",
    },
  ],
  transactions: [
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
  function: [
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
  rules: [
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
  api_key: [
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
  dispute: [
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
  ({
    title,
    showBtn,
    defaultValues,
    onSubmit,
    loading,
  }: RolePermission<any>) => {
    const { ForgeForm, watch, setValue, getValues } = useForge({
      defaultValues,
    });

    const handleSubmit = () => {
      onSubmit(getValues());
    };

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
                <div className="py-3">
                  <Forger
                    name="dashboard"
                    label="Dashboard"
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
                              setValue(`${props.name}-actions`, []);
                              return;
                            }
                            setValue(`${props.name}-actions`, [
                              `view_${props.name}`,
                            ]);
                          }}
                        />
                      </div>
                    )}
                  />

                  {watch("dashboard") && (
                    <div className="flex gap-2">
                      {actions?.["dashboard"]?.map?.((item) => (
                        <div>
                          <Checkbox
                            id={item?.id}
                            disabled={item.id === "read"}
                            checked={watch("dashboard-actions")?.includes?.(
                              item.id === "read"
                                ? "view_dashboard"
                                : `${item.id}_dashboard`
                            )}
                            // defaultChecked={item.id === "read"}
                            onCheckedChange={(checked) => {
                              if (checked === false) {
                                setValue(
                                  `dashboard-actions`,
                                  getValues("dashboard-actions").filter(
                                    (pri: string) => pri !== `${item.id}_roles`
                                  )
                                );
                                return;
                              }
                              setValue(`dashboard-actions`, [
                                ...getValues("dashboard-actions"),
                                `${item.id}_dashboard`,
                              ]);
                            }}
                            className={
                              "data-[state=checked]:bg-primary data-[state=checked]:text-white "
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

                <div className="py-3">
                  <Forger
                    name="roles"
                    label="Roles"
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
                              setValue(`${props.name}-actions`, []);
                              return;
                            }
                            setValue(`${props.name}-actions`, [
                              `view_${props.name}`,
                            ]);
                          }}
                        />
                      </div>
                    )}
                  />

                  {watch("roles") && (
                    <div className="flex gap-2">
                      {actions?.["roles"]?.map?.((item) => (
                        <div>
                          <Checkbox
                            id={item?.id}
                            disabled={item.id === "read"}
                            checked={watch("roles-actions")?.includes?.(
                              item.id === "read"
                                ? "view_roles"
                                : `${item.id}_roles`
                            )}
                            // defaultChecked={item.id === "read"}
                            onCheckedChange={(checked) => {
                              if (checked === false) {
                                setValue(
                                  `roles-actions`,
                                  getValues("roles-actions").filter(
                                    (pri: string) => pri !== `${item.id}_roles`
                                  )
                                );
                                return;
                              }
                              setValue(`roles-actions`, [
                                ...getValues("roles-actions"),
                                `${item.id}_roles`,
                              ]);
                            }}
                            className={
                              "data-[state=checked]:bg-primary data-[state=checked]:text-white "
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

                <div className="py-3">
                  <Forger
                    name="rules"
                    label="Rules"
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
                              setValue(`${props.name}-actions`, []);
                              return;
                            }
                            setValue(`${props.name}-actions`, [
                              `get_${props.name}`,
                            ]);
                          }}
                        />
                      </div>
                    )}
                  />

                  {watch("rules") && (
                    <div className="flex gap-2">
                      {actions["rules"].map((item) => (
                        <div>
                          <Checkbox
                            id={item?.id}
                            disabled={item.id === "get"}
                            checked={watch("rules-actions")?.includes?.(
                              item.id === "get"
                                ? "get_rules"
                                : `${item.id}_rules`
                            )}
                            // defaultChecked={item.id === "read"}
                            onCheckedChange={(checked) => {
                              if (checked === false) {
                                setValue(
                                  `rules-actions`,
                                  getValues("rules-actions").filter(
                                    (pri: string) => pri !== `${item.id}_rules`
                                  )
                                );
                                return;
                              }
                              setValue(`rules-actions`, [
                                ...getValues("rules-actions"),
                                `${item.id}_rules`,
                              ]);
                            }}
                            className={
                              "data-[state=checked]:bg-primary data-[state=checked]:text-white "
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

                <div className="py-3">
                  <Forger
                    name="api_key"
                    label="Api Keys"
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
                              setValue(`${props.name}-actions`, []);
                              return;
                            }
                            setValue(`${props.name}-actions`, [
                              `view_${props.name}`,
                            ]);
                          }}
                        />
                      </div>
                    )}
                  />

                  {watch("api_key") && (
                    <div className="flex gap-2">
                      {actions["api_key"].map((item) => (
                        <div>
                          <Checkbox
                            id={item?.id}
                            disabled={item.id === "read"}
                            checked={watch("api_key-actions")?.includes?.(
                              item.id === "read"
                                ? "view_api_key"
                                : `${item.id}_api_key`
                            )}
                            // defaultChecked={item.id === "read"}
                            onCheckedChange={(checked) => {
                              if (checked === false) {
                                setValue(
                                  `api_key-actions`,
                                  getValues("api_key-actions")?.filter?.(
                                    (pri: string) =>
                                      pri !== `${item.id}_api_key`
                                  )
                                );
                                return;
                              }
                              setValue(`api_key-actions`, [
                                ...getValues("api_key-actions"),
                                `${item.id}_api_key`,
                              ]);
                            }}
                            className={
                              "data-[state=checked]:bg-primary data-[state=checked]:text-white "
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

                <div className="py-3">
                  <Forger
                    name="function"
                    label="Function"
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
                              setValue(`${props.name}-actions`, []);
                              return;
                            }
                            setValue(`${props.name}-actions`, [
                              `view_${props.name}`,
                            ]);
                          }}
                        />
                      </div>
                    )}
                  />

                  {watch("function") && (
                    <div className="flex items-center gap-2">
                      {actions["function"].map((item) => (
                        <div>
                          <Checkbox
                            id={item?.id}
                            disabled={item.id === "read"}
                            checked={watch("function-actions").includes(
                              item.id === "read"
                                ? "view_function"
                                : `${item.id}_function`
                            )}
                            // defaultChecked={item.id === "read"}
                            onCheckedChange={(checked) => {
                              if (checked === false) {
                                setValue(
                                  `function-actions`,
                                  getValues("function-actions").filter(
                                    (pri: string) =>
                                      pri !== `${item.id}_function`
                                  )
                                );
                                return;
                              }
                              setValue(`function-actions`, [
                                ...getValues("function-actions"),
                                `${item.id}_function`,
                              ]);
                            }}
                            className={
                              "data-[state=checked]:bg-primary data-[state=checked]:text-white "
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

                <div className="py-3">
                  <Forger
                    name="dispute"
                    label="Dispute"
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
                              setValue(`${props.name}-actions`, []);
                              return;
                            }
                            setValue(`${props.name}-actions`, [
                              `view_${props.name}`,
                            ]);
                          }}
                        />
                      </div>
                    )}
                  />

                  {watch("dispute") && (
                    <div className="flex gap-2">
                      {actions["dispute"].map((item) => (
                        <div>
                          <Checkbox
                            id={item?.id}
                            disabled={item.id === "read"}
                            checked={watch("dispute-actions")?.includes?.(
                              item.id === "read"
                                ? "view_dispute"
                                : `${item.id}_dispute`
                            )}
                            // defaultChecked={item.id === "read"}
                            onCheckedChange={(checked) => {
                              if (checked === false) {
                                setValue(
                                  `dispute-actions`,
                                  getValues("dispute-actions")?.filter?.(
                                    (pri: string) =>
                                      pri !== `${item.id}_dispute`
                                  )
                                );
                                return;
                              }
                              setValue(`dispute-actions`, [
                                ...getValues("dispute-actions"),
                                `${item.id}_dispute`,
                              ]);
                            }}
                            className={
                              "data-[state=checked]:bg-primary data-[state=checked]:text-white "
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

                <div className="py-3">
                  <Forger
                    name="transactions"
                    label="Transactions"
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
                              setValue(`${props.name}-actions`, []);
                              return;
                            }
                            setValue(`${props.name}-actions`, [
                              `view_${props.name}`,
                            ]);
                          }}
                        />
                      </div>
                    )}
                  />

                  {watch("transactions") && (
                    <div className="flex gap-2">
                      {actions["transactions"].map((item) => (
                        <div>
                          <Checkbox
                            id={item?.id}
                            disabled={item.id === "read"}
                            checked={watch("transactions-actions").includes(
                              item.id === "read"
                                ? "view_transactions"
                                : `${item.id}_transactions`
                            )}
                            onCheckedChange={(checked) => {
                              if (checked === false) {
                                setValue(
                                  `transactions-actions`,
                                  getValues("transactions-actions").filter(
                                    (pri: string) =>
                                      pri !== `${item.id}_transactions`
                                  )
                                );
                                return;
                              }
                              setValue(`transactions-actions`, [
                                ...getValues("transactions-actions"),
                                `${item.id}_transactions`,
                              ]);
                            }}
                            className={
                              "data-[state=checked]:bg-primary data-[state=checked]:text-white "
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

                <div className="py-3">
                  <Forger
                    name="members"
                    label="Team Member"
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
                              setValue(`${props.name}-actions`, []);
                              return;
                            }
                            setValue(`${props.name}-actions`, [
                              `view_${props.name}`,
                            ]);
                          }}
                        />
                      </div>
                    )}
                  />

                  {watch("members") && (
                    <div className="flex gap-2">
                      {actions["members"].map((item) => (
                        <div>
                          <Checkbox
                            id={item?.id}
                            disabled={item.id === "read"}
                            checked={watch("members-actions").includes(
                              item.id === "read"
                                ? "view_members"
                                : `${item.id}_members`
                            )}
                            // defaultChecked={item.id === "read"}
                            onCheckedChange={(checked) => {
                              if (checked === false) {
                                setValue(
                                  `members-actions`,
                                  getValues("members-actions").filter(
                                    (pri: string) =>
                                      pri !== `${item.id}_members`
                                  )
                                );
                                return;
                              }
                              setValue(`members-actions`, [
                                ...getValues("members-actions"),
                                `${item.id}_members`,
                              ]);
                            }}
                            className={
                              "data-[state=checked]:bg-primary data-[state=checked]:text-white "
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

                <div className="py-3">
                  <Forger
                    name="logs"
                    label="Team Logs"
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
                              setValue(`${props.name}-actions`, []);
                              return;
                            }
                            setValue(`${props.name}-actions`, [
                              `view_${props.name}`,
                            ]);
                          }}
                        />
                      </div>
                    )}
                  />

                  {watch("logs") && (
                    <div className="flex gap-2">
                      {actions["logs"].map((item) => (
                        <div>
                          <Checkbox
                            id={item?.id}
                            disabled={item.id === "read"}
                            checked={watch("logs-actions").includes(
                              item.id === "read"
                                ? "view_logs"
                                : `${item.id}_logs`
                            )}
                            // defaultChecked={item.id === "read"}
                            onCheckedChange={(checked) => {
                              if (checked === false) {
                                setValue(
                                  `logs-actions`,
                                  getValues("logs-actions").filter(
                                    (pri: string) => pri !== `${item.id}_logs`
                                  )
                                );
                                return;
                              }
                              setValue(`logs-actions`, [
                                ...getValues("logs-actions"),
                                `${item.id}_logs`,
                              ]);
                            }}
                            className={
                              "data-[state=checked]:bg-primary data-[state=checked]:text-white "
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
