package command

import (
	"fmt"
	"strings"
)

func (c *command) ListContexts() ([]string, error) {
	out, err := c.kubectl("config", "get-contexts", "-o", "name")
	if err != nil {
		return nil, err
	}
	return splitLines(out), nil
}

func (c *command) ListNamespaces(context string) ([]string, error) {
	if strings.TrimSpace(context) == "" {
		return nil, fmt.Errorf("context is required")
	}
	out, err := c.kubectl(
		"get",
		"namespaces",
		"--context",
		context,
		"--field-selector",
		"status.phase=Active",
		"-o",
		"name",
	)
	if err != nil {
		return nil, err
	}
	return stripPrefix(splitLines(out), "namespace/"), nil
}

func (c *command) ListPods(context, namespace string) ([]string, error) {
	if strings.TrimSpace(context) == "" {
		return nil, fmt.Errorf("context is required")
	}
	if strings.TrimSpace(namespace) == "" {
		return nil, fmt.Errorf("namespace is required")
	}
	out, err := c.kubectl(
		"get",
		"pods",
		"--context",
		context,
		"--namespace",
		namespace,
		"-o",
		"name",
	)
	if err != nil {
		return nil, err
	}
	return stripPrefix(splitLines(out), "pod/"), nil
}

func (c *command) ListContainers(context, namespace, pod string) ([]string, error) {
	if strings.TrimSpace(context) == "" {
		return nil, fmt.Errorf("context is required")
	}
	if strings.TrimSpace(namespace) == "" {
		return nil, fmt.Errorf("namespace is required")
	}
	if strings.TrimSpace(pod) == "" {
		return nil, fmt.Errorf("pod is required")
	}
	out, err := c.kubectl(
		"get",
		"pod",
		pod,
		"--context",
		context,
		"--namespace",
		namespace,
		"-o",
		"jsonpath={.spec.containers[*].name}",
	)
	if err != nil {
		return nil, err
	}
	fields := strings.Fields(out)
	if len(fields) == 0 {
		return nil, fmt.Errorf("no containers found")
	}
	return fields, nil
}

func splitLines(value string) []string {
	var out []string
	for _, line := range strings.Split(value, "\n") {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		if strings.HasPrefix(line, "No resources found") {
			continue
		}
		out = append(out, line)
	}
	return out
}

func stripPrefix(values []string, prefix string) []string {
	if prefix == "" {
		return values
	}
	out := make([]string, 0, len(values))
	for _, value := range values {
		out = append(out, strings.TrimPrefix(value, prefix))
	}
	return out
}
