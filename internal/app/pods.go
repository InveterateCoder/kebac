package app

import "github.com/InveterateCoder/kebac/internal/command"

func (a *App) ListPods(context, namespace string) ([]string, error) {
	return command.Cmd.ListPods(context, namespace)
}

func (a *App) ListContainers(context, namespace, pod string) ([]string, error) {
	return command.Cmd.ListContainers(context, namespace, pod)
}
