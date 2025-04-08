import os
import sys

SERVICE_TEMPLATE="""
    export class {name}Service{{
        constructor(){{
        }}
    }}
"""

CONTROLLER_TEMPLATE="""
    export class {name}Controller{{
        constructor(){{
        }}
    }}
"""

ROUTER_TEMPLATE="""
    import {{ Router }} from 'express';

    const router = Router();

    // define routes here

    export default router;
"""

def create_files(module_name,target_path):
    module_folder_path = os.path.join(target_path, module_name)
    os.makedirs(module_folder_path, exist_ok=True)

    files={
        f"{module_name}.service.ts":SERVICE_TEMPLATE.format(name=module_name),
        f"{module_name}.controller.ts":CONTROLLER_TEMPLATE.format(name=module_name),
        f"{module_name}.router.ts":SERVICE_TEMPLATE.format(name=module_name)
    }

    for file_name,content in files.items():
        file_path=os.path.join(module_folder_path,file_name)
        with open(file_path,"w") as f:
            f.write(content)
        print(f"✅ Created {file_path}")

if __name__ == "__main__":
    if len(sys.argv) != 4 or sys.argv[1] != "create":
        print("Usage: python generate.py create <ModuleName> <Path>")
        sys.exit(1)

    module = sys.argv[2]
    path = sys.argv[3]
    create_files(module, path)